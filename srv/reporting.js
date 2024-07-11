const cds = require("@sap/cds");
 
class Reporting extends cds.ApplicationService {
 
    init() {
 
        this.on("sku_salesAgent", async (req) => {
            try {
                const db = await cds.connect.to("db");
                const dbClass = require('sap-hdbext-promisfied');
                let dbConn = new dbClass(await dbClass.createConnection(db.options.credentials));
 
                var statementpreparation = 'SELECT SKU_NAME AS SKUNAME, SKUID, TOTALINSENTIVE, SALES_AGENT '
                +' FROM ( '
                +' SELECT DISTINCT SKUID,TOTALINSENTIVE,SALE_DATE,SALES_AGENT, '
                +' ROW_NUMBER() OVER (PARTITION BY SALES_AGENT,SKUID  ORDER BY SALE_DATE DESC) AS rn '
                +' FROM "TESTICM_HDI_TESTICM_DB_DEPLOYER_1"."ICM_TRANS_CAL_DATA" '
                +' WHERE SALES_AGENT = \'' + req.data.empcode + '\'  '
                +' AND SCHEMEID = \'' + req.data.schemeid + '\' AND ISDEL = \'0\') '
                +' AS LatestSales LEFT JOIN "TESTICM_HDI_TESTICM_DB_DEPLOYER_1"."ICM_SKU_MASTER" AS T1 ON T1.SKUCODE = LatestSales.SKUID'
                +' WHERE rn = \'1\' ';
 
 
                const sp = await dbConn.preparePromisified(statementpreparation);
 
                var SalesData = await dbConn.statementExecPromisified(sp, []);
 
                console.log(SalesData);
 
              }catch (error) {
                console.error(error)
                return {}
            }
        });
 
 
        this.on("regionwise_salesAgent", async (req) => {
            try {
                const db = await cds.connect.to("db");
                const dbClass = require('sap-hdbext-promisfied');
                let dbConn = new dbClass(await dbClass.createConnection(db.options.credentials));
 
                var statementpreparation = 'SELECT  REGIONCODE,TOTALINSENTIVE '
                +' FROM ( '
                +' SELECT DISTINCT '
                +'        REGIONCODE, '
                +'        TOTALINSENTIVE, '
                +'        ROW_NUMBER() OVER (PARTITION BY REGIONCODE  ORDER BY SALE_DATE DESC) AS rn '
                +'    FROM "TESTICM_HDI_TESTICM_DB_DEPLOYER_1"."ICM_TRANS_CAL_DATA" '
                +'    WHERE SALES_AGENT = \'104\' AND ISDEL = \'0\') '
                +'    AS LatestSales '
                +'    WHERE rn = \'1\'';
 
 
                const sp = await dbConn.preparePromisified(statementpreparation);
              
                var RegionSalesData = await dbConn.statementExecPromisified(sp, []);
 
                console.log(RegionSalesData);
                return {RegionSalesData};
 
              }catch (error) {
                console.error(error)
                return {}
            }
        });
 
        this.on("schemewise_salesAgent", async (req) => {
            try {
                const db = await cds.connect.to("db");
                const dbClass = require('sap-hdbext-promisfied');
                let dbConn = new dbClass(await dbClass.createConnection(db.options.credentials));
 
                var statementpreparation = 'SELECT  SCHEME,TOTALINSENTIVE '
                +' FROM ( '
                +' SELECT DISTINCT '
                +'        SCHEME, '
                +'        TOTALINSENTIVE, '
                +'        ROW_NUMBER() OVER (PARTITION BY SCHEME  ORDER BY SALE_DATE DESC) AS rn '
                +'    FROM "TESTICM_HDI_TESTICM_DB_DEPLOYER_1"."ICM_TRANS_CAL_DATA" '
                +'    WHERE SALES_AGENT = \'104\' AND ISDEL = \'0\') '
                +'    AS LatestSales '
                +'    WHERE rn = \'1\'';
 
 
                const sp = await dbConn.preparePromisified(statementpreparation);
 
                var SchemeSalesData = await dbConn.statementExecPromisified(sp, []);
 
                console.log(SchemeSalesData);
                return {SchemeSalesData};
 
              }catch (error) {
                console.error(error)
                return {}
            }
        });
 
 
 
 
                return super.init();
            }
 
}
 
module.exports = { Reporting };