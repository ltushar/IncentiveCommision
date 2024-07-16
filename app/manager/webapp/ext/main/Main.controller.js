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
<<<<<<< HEAD

=======
              const regEx = /\d/g,
                getNumber = (value) =>
                  ((value || "").match(regEx) || "").join("");
>>>>>>> 716334d2fc9f76ab12314be1c6c65ff32ed31e95
              if (!response) {
                MessageBox.warning("There no data for this scheme.");
                return;
              }
 
              localModel.setProperty(
                "/SalesTransData",
                response.value.SalesTransData.sort(function (first, second) {
<<<<<<< HEAD
                  const reg = /\d/g,
                    _getNumber = (value) =>
                      ((value || "").match(reg) || "").join(""),
                    salesAgentComparison =
                      Number(_getNumber(first.SALES_AGENT)) -
                      Number(_getNumber(second.SALES_AGENT));
                  if (salesAgentComparison !== 0) {
                    return salesAgentComparison;
                  }

=======
                  const salesAgentComparison =
                    Number(getNumber(first.SALES_AGENT)) -
                    Number(getNumber(second.SALES_AGENT));
                  if (salesAgentComparison !== 0) {
                    return salesAgentComparison;
                  }
 
>>>>>>> 716334d2fc9f76ab12314be1c6c65ff32ed31e95
                  const dateA = new Date(first.SALE_DATE || 0);
                  const dateB = new Date(second.SALE_DATE || 0);
                  return dateA.getTime() - dateB.getTime();
                })
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
