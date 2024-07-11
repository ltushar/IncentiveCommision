sap.ui.define(
  [
    "sap/fe/core/PageController",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
  ],
  function (PageController, ChartFormatter, Format) {
    "use strict";

    return PageController.extend("sales.ext.main.Main", {
      onInit: function () {
        const model = new sap.ui.model.json.JSONModel({});
        this.getView().setModel(model, "globalModel");
      },
      onAfterRendering: function () {
        this.onFetchData();
      },

      onFetchChartData: function () {
        this.onSchemaChart();
        this.onRegionChart();
      },
      onSchemaChart: function () {
        Format.numericFormatter(ChartFormatter.getInstance());
        const oFormatPattern = ChartFormatter.DefaultPattern,
          globalModel = this.getView().getModel("globalModel"),
          oDataModel = this.getAppComponent().getModel(),
          serviceURL = oDataModel.getServiceUrl(),
          oVizFrame = this.getView().byId("idSchema"),
          oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [
              {
                name: "Type",
                value: "{globalModel>SCHEME}",
              },
            ],
            measures: [
              {
                name: "Total Incentive",
                value: "{globalModel>TOTALINSENTIVE}",
              },
            ],
            data: {
              path: "globalModel>/oIncentiveSchemeChart",
            },
          });

        oVizFrame.setVizProperties({
          plotArea: {
            colorPalette: ["#A4C639"],
            dataLabel: {
              showTotal: true,
              visible: false,
            },
          },
          valueAxis: {
            label: {
              formatString: oFormatPattern.STANDARDINTEGER,
            },
            title: {
              visible: false,
            },
          },
          categoryAxis: {
            title: {
              visible: false,
            },
          },
          tooltip: {
            visible: true,
          },
          title: {
            text: "Schema Wise",
          },
        });
        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(this.getModel("globalModel"));

        oVizFrame.addFeed(
          this._getFeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Total Incentive"],
          })
        );

        oVizFrame.addFeed(
          this._getFeedItem({
            uid: "categoryAxis",
            type: "Dimension",
            values: ["Type"],
          })
        );
      },

      onRegionChart: function () {
        Format.numericFormatter(ChartFormatter.getInstance());
        const oFormatPattern = ChartFormatter.DefaultPattern,
          globalModel = this.getView().getModel("globalModel"),
          oDataModel = this.getAppComponent().getModel(),
          serviceURL = oDataModel.getServiceUrl(),
          oVizFrame = this.getView().byId("idRegion"),
          oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [
              {
                name: "Type",
                value: "{globalModel>REGIONCODE}",
              },
            ],
            measures: [
              {
                name: "Total Incentive",
                value: "{globalModel>TOTALINSENTIVE}",
              },
            ],
            data: {
              path: "globalModel>/oIncentiveRegionChart",
            },
          });

        oVizFrame.setVizProperties({
          plotArea: {
            colorPalette: ["#5F27CD"],
            dataLabel: {
              showTotal: true,
              visible: false,
            },
          },
          valueAxis: {
            label: {
              formatString: oFormatPattern.STANDARDINTEGER,
            },
            title: {
              visible: false,
            },
          },
          categoryAxis: {
            title: {
              visible: false,
            },
          },
          tooltip: {
            visible: true,
          },
          title: {
            text: "Region Wise",
          },
        });
        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(this.getModel("globalModel"));

        oVizFrame.addFeed(
          this._getFeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Total Incentive"],
          })
        );

        oVizFrame.addFeed(
          this._getFeedItem({
            uid: "categoryAxis",
            type: "Dimension",
            values: ["Type"],
          })
        );
      },

      _getFeedItem: function (oObject) {
        return new sap.viz.ui5.controls.common.feeds.FeedItem(oObject);
      },

      onFetchData: function () {
        const globalModel = this.getView().getModel("globalModel"),
          oDataModel = this.getAppComponent().getModel(),
          serviceURL = oDataModel.getServiceUrl();

        jQuery.ajax({
          type: "POST",
          url: serviceURL + "schemewise_salesAgent",
          data: JSON.stringify({}),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function (response) {
            globalModel.setProperty(
              "/oIncentiveSchemeChart",
              response.value.SchemeSalesData
            );
          },
          error: console.error,
        });

        jQuery.ajax({
          type: "POST",
          url: serviceURL + "regionwise_salesAgent",
          data: JSON.stringify({}),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function (response) {
            globalModel.setProperty(
              "/oIncentiveRegionChart",
              response.value.RegionSalesData
            );
          },
          error: console.error,
        });

        this.onFetchChartData();
      },
    });
  }
);
