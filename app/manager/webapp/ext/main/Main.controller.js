sap.ui.define(
  [
    "sap/fe/core/PageController",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (PageController, MessageBox, Fragment, Filter, FilterOperator) {
    "use strict";

    return PageController.extend("manager.ext.main.Main", {
      onInit: function () {
        const model = new sap.ui.model.json.JSONModel({
          pages: [
            {
              text: "Calculate Schemes",
              key: "idPageCalculate",
              icon: "sap-icon://simulate",
            },
          ],
        });
        this.getView().setModel(model, "localModel");
      },

      onCalculationRun: function (oEvent) {
        const path = oEvent.getSource().getBindingContext().getPath(),
          oDataModel = this.getAppComponent().getModel(),
          localModel = this.getView().getModel("localModel"),
          serviceUrl = oDataModel.getServiceUrl(),
          oView = this.getView(),
          that = this;
        oView.setBusy(true);
        if (!this._oCalculatePopUp) {
          this._oCalculatePopUp = Fragment.load({
            id: oView.getId(),
            name: "manager.ext.fragment.CalculatePopup",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }

        $.get(serviceUrl.slice(0, -1) + path, function (response) {
          const payload = {
            schemeid: response.schemeid,
            schemename: response.schemename,
            skuid: response.skuid,
            regioncode: response.regioncode,
            empcode: response.empcode,
            minsales: response.minsales,
            percentile: response.percentile,
            from_date: response.from_date,
            to_date: response.to_date,
            icid: response.ICID,
          };
          $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: serviceUrl + "calculatedata",
            data: JSON.stringify(payload),
            success: function (response) {
              oView.setBusy(false);
            
              if (!response) {
                MessageBox.warning("There no data for this scheme.");
                return;
              }

              localModel.setProperty(
                "/SalesTransData",
                response.value.SalesTransData
              );
              that._oCalculatePopUp.then((oDialog) => oDialog.open());
            },
            error: function () {
              oView.setBusy(false);
            },
          });
        });
      },

      onCalculatePopClose: function () {
        this._oCalculatePopUp.then((oDialog) => oDialog.close());
      },

      onDateFormatter: function (value) {
        if (!value) return "";
        const oDateObject = new Date(value),
          oDateObjectNew = new Date(
            oDateObject.getTime() + oDateObject.getTimezoneOffset() * 60000
          );

        return sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "dd MMM, yyyy",
        }).format(oDateObjectNew);
      },

      onCalculationNav: function (oEvent) {
        const oView = this.getView(),
          sQuery = oEvent.getSource().getBindingContext().getObject("ICID");

        if (!this._oNewCalculatePopUp) {
          this._oNewCalculatePopUp = Fragment.load({
            id: oView.getId(),
            name: "manager.ext.fragment.CalculateResult",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }

        this._oNewCalculatePopUp.then(function (oDialog) {
          oDialog.open();

          oDialog
            .getContent()[0]
            .getBinding("items")
            .filter([new Filter("icid", FilterOperator.EQ, sQuery)]);
        });
      },

      onCalculationNavClose: function () {
        this._oNewCalculatePopUp.then((oDialog) => oDialog.close());
      },
    });
  }
);
