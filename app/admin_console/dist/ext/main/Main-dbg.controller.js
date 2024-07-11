sap.ui.define(
  [
    "sap/fe/core/PageController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (PageController, JSONModel, Fragment, MessageToast, MessageBox) {
    "use strict";

    return PageController.extend("adminconsole.ext.main.Main", {
      onInit: function () {
        const model = new JSONModel({
          min: 0,
          max: 100,
          pages: [
            {
              text: "Incentive",
              key: "idPageIncentive",
              icon: "sap-icon://employee",
            },
            {
              text: "Calculate Schemes",
              key: "idPageCalculate",
              icon: "sap-icon://simulate",
            },
          ],
          calculate: {
            to_date: "",
            from_date: "",
            to_date_min_date: new Date(),
          },
        });

        this.getView().setModel(model, "localModel");
      },

      onAfterRendering: function () {
        this.onFetchMasterData();
      },

      onFetchMasterData: function () {
        const oDataModel = this.getView().getModel(),
          localModel = this.getView().getModel("localModel"),
          service_url = oDataModel.getServiceUrl();

        // @ts-ignore
        $.get(service_url + "SkuCode", function (response) {
          const value = response.value;
          localModel.setProperty("/SkuCode", value);
        });

        // @ts-ignore
        $.get(service_url + "Region", function (response) {
          const value = response.value;
          localModel.setProperty("/Region", value);
        });

        // @ts-ignore
        $.get(service_url + "OrgData", function (response) {
          const value = response.value;
          localModel.setProperty("/OrgData", value);
        });
      },

      onPressIncentiveAddMoreOpen: function () {
        const oView = this.getView(),
          localModel = oView.getModel("localModel");
        if (!this._oIncentive) {
          this._oIncentive = Fragment.load({
            id: oView.getId(),
            name: "adminconsole.ext.fragments.AddMoreIncentive",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        return this._oIncentive.then(function (oDialog) {
          oDialog.open();
          localModel.setProperty("/incentive", {
            schemename: "",
            skuid: "",
            regioncode: "",
            empcode: "",
            minsales: 0,
            percentile: 0,
          });
        });
      },

      onIncentiveTablePress: function (oEvent) {
        const object = oEvent.getSource().getBindingContext().getObject(),
          localModel = this.getView().getModel("localModel");

        this.onPressIncentiveAddMoreOpen().then(function () {
          localModel.setProperty("/incentive", object);
        });
      },

      onIncentiveSubmit: function () {
        const oDataModel = this.getAppComponent().getModel(),
          serviceURL = oDataModel.getServiceUrl(),
          localModel = this.getView().getModel("localModel"),
          incentive = localModel.getProperty("/incentive"),
          idIncentiveTable = this.getView().byId("idIncentiveTable"),
          that = this;

        // @ts-ignore
        $.ajax({
          type: incentive.ID ? "PATCH" : "POST",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          url:
            serviceURL +
            (incentive.ID
              ? "Insentive(ID=" + incentive.ID + ",IID=" + incentive.IID + ")"
              : "Insentive"),
          data: JSON.stringify(incentive),
          success: function () {
            MessageBox.success("Incentive Added Successfully", {
              onClose: function () {
                idIncentiveTable.getBindingInfo("items").binding.refresh();
                that.onPressIncentiveAddMoreClose();
              },
            });
          },
          error: console.error,
        });
      },

      onPressIncentiveAddMoreClose: function () {
        this._oIncentive.then(function (oDialog) {
          oDialog.close();
        });
      },

      onPercentageChange: function (oEvent) {
        const value = oEvent.getSource().getValue();
        if (value > 100 || value < 0) {
          MessageToast.show("Percentage should be between 0 and 100", {
            duration: 3000,
            position: "center",
          });
          oEvent.getSource().setValue(0);
        }
      },

      onItemSelect: function (oEvent) {
        const oItem = oEvent.getParameter("item");
        this.byId("idNavContainer").to(this.getView().createId(oItem.getKey()));
      },

      onIncentiveCalSelect: function (oEvent) {
        const selectedObject = oEvent
            .getParameter("selectedItem")
            .getBindingContext()
            .getObject(),
          oDataModel = this.getAppComponent().getModel(),
          serviceURL = oDataModel.getServiceUrl(),
          localModel = this.getView().getModel("localModel"),
          calculate = localModel.getProperty("/calculate");

        // @ts-ignore
        $.get(
          serviceURL +
            "Insentive(IID=" +
            selectedObject.IID +
            ",ID=" +
            selectedObject.ID +
            ")",
          function (response) {
            localModel.setProperty("/calculate", {
              schemeid: calculate.schemeid,
              schemename: calculate.schemename,
              skuid: response.skuid,
              regioncode: response.regioncode,
              empcode: response.empcode,
              minsales: response.minsales,
              percentile: response.percentile,
              to_date: "",
              from_date: "",
              to_date_min_date: new Date(),
            });
          }
        );
      },

      onCalculateFromDateChange: function (oEvent) {
        const localModel = this.getView().getModel("localModel");
        if (oEvent.getSource().getValue())
          localModel.setProperty(
            "/calculate/to_date_min_date",
            new Date(oEvent.getSource().getValue())
          );
      },

      onCalculationSubmit: function (oEvent) {
        const localModel = this.getView().getModel("localModel"),
          calculate = JSON.parse(
            JSON.stringify(localModel.getProperty("/calculate"))
          ),
          oDataModel = this.getAppComponent().getModel(),
          serviceURL = oDataModel.getServiceUrl(),
          idCalculationTable = this.getView().byId("idCalculationTable");

        delete calculate["to_date_min_date"];
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          url: serviceURL + "InsentiveRanFor",
          data: JSON.stringify(calculate),
          success: function (response) {
            MessageBox.success("Incentive Calculation Added Successfully!", {
              onClose: function () {
                idCalculationTable.getBindingInfo("items").binding.refresh();
                localModel.setProperty("/calculate", {});
              },
            });
          },
          error: console.error,
        });
      },

      /**
       * Internal functions
       */

      _onFormatRegion: function (value) {
        if (!value) return "";

        const localModel = this.getView().getModel("localModel"),
          array = localModel.getProperty("/Region");
        if (!array) return "";
        const object = array.find((item) => item.region_code === value);
        if (object) {
          return object.Region_name;
        }
        return "";
      },

      _onFormatOrg: function (value) {
        if (!value) return "";

        const localModel = this.getView().getModel("localModel"),
          array = localModel.getProperty("/OrgData");

        if (!array) return "";

        const object = array.find((item) => item.empcode === value);
        if (object) {
          return object["function"];
        }
        return "";
      },

      _onFormatSKU: function (value) {
        if (!value) return "";

        const localModel = this.getView().getModel("localModel"),
          array = localModel.getProperty("/SkuCode");
        if (!array) return "";
        const object = array.find((item) => item.skucode === value);
        if (object) {
          return object.sku_name;
        }
        return "";
      },
    });
  }
);
