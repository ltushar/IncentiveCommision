const cds = require("@sap/cds");
const { Console } = require("console");


function lPad(str, size) {
    var s = str.toString();
    while (s.length < size) {
        s = "0" + s;
    }
    return s; // return new number
}

class InsentiveCommision extends cds.ApplicationService {

    init() {

        const { Insentive } = this.entities;
        this.before('CREATE', Insentive, async (context) => {
            const db = await cds.connect.to("db");
            var x = await db.run('SELECT "INCENTIVE_ID".NEXTVAL FROM DUMMY');
            var numfinal = x[0]["INCENTIVE_ID.NEXTVAL"];
            context.data.IID = numfinal;
            console.log(numfinal);
        });

        const { InsentiveRanFor } = this.entities;
        this.before('CREATE', InsentiveRanFor, async (context) => {
            const db = await cds.connect.to("db");
            var x = await db.run('SELECT "ICID_ID".NEXTVAL FROM DUMMY');
            var numberfinal = x[0]["ICID_ID.NEXTVAL"];
            context.data.ICID = numberfinal;

        });

        return super.init();
    }

}


class ManagerCalculation extends cds.ApplicationService {

    init() {
        var d = new Date();
        var dt = d.getFullYear() + '-' + lPad((d.getMonth() + 1), 2) + '-' + lPad(d.getDate(), 2);
        var rowid = 0;
        this.on("calculatedata", async (req) => {
            try {
                var SalesData = new Array();
                var SalesTransData = new Array();

                const db = await cds.connect.to('db')
                const dbClass = require('sap-hdbext-promisfied');
                let dbConn = new dbClass(await dbClass.createConnection(db.options.credentials));



            var query = 'SELECT COUNT(1) as CS FROM ICM_TRANS_CAL_DATA WHERE SCHEMEID = ? AND CREATEDDATE = ? AND PERCENTILE = ?';
            //console.log(query);
            const sp1 = await dbConn.preparePromisified(query);
            var SchemeData = await dbConn.statementExecPromisified(sp1, [req.data.schemeid, dt, req.data.percentile]);
            var cnt = SchemeData[0]["CS"];
            //console.log(cnt);
            if(cnt === 0){
                rowid = 1;
            }else{

                const query2 = await db.run('SELECT TOP 1 (ROWSID + 1) AS ROWSID FROM ICM_TRANS_CAL_DATA WHERE ISDEL = 0 ORDER BY CID DESC', []);
                var rowid = query2[0]["ROWSID"];
            }

                var statementpreparation = ' SELECT SKUID,REGIONCODE,SALES_AGENT, DAILY_SALES ,SALE_DATE,SUM(DAILY_SALES) OVER (PARTITION BY SALES_AGENT ORDER BY SALE_DATE,SKUID,REGIONCODE,SALES_AGENT) AS TOTAL_SALES , '
                    + ' (CASE WHEN SUM(DAILY_SALES) OVER (PARTITION BY SALES_AGENT ORDER BY SALE_DATE,SKUID,REGIONCODE,SALES_AGENT) >= ? '
                    + '  THEN TO_DECIMAL(SUM(DAILY_SALES) OVER (PARTITION BY SALES_AGENT ORDER BY SALE_DATE,SKUID,REGIONCODE,SALES_AGENT)* ?/100 ,10,2) ELSE 0 END ) AS TOTAL_INCENTIVE FROM '
                    + ' (SELECT SKUID,REGIONCODE,SALES_AGENT,SUM(ACTUALSALES) AS DAILY_SALES ,SALE_DATE FROM ICM_TRANSACTION_SALESDATA WHERE 1=1 AND '
                    +'  SALES_AGENT IN(SELECT DISTINCT EMPCODE FROM ICM_ORG_HIERARCHY WHERE REPORTING_TO_EMAIL = \'tushar.ladhe@initiumdigital.com\' ) ';

                if (req.data.skuid !== null && req.data.skuid !== undefined && req.data.skuid !== '') {
                    statementpreparation += 'AND SKUID IN (\'' + req.data.skuid + '\') '
                }
                if (req.data.regioncode !== null && req.data.regioncode !== undefined && req.data.regioncode !== '') {
                    statementpreparation += 'AND REGIONCODE IN (\'' + req.data.regioncode + '\') '
                }
                if (req.data.empcode !== null && req.data.empcode !== undefined && req.data.empcode !== '') {
                    statementpreparation += 'AND SALES_AGENT IN (\'' + req.data.empcode + '\') '
                }
                statementpreparation += 'AND SALE_DATE BETWEEN ? AND ? GROUP BY SKUID,REGIONCODE,SALES_AGENT,SALE_DATE ORDER BY SALE_DATE ASC '
                    + ' )GROUP BY SKUID,REGIONCODE,SALES_AGENT,SALE_DATE,DAILY_SALES ORDER BY SALE_DATE,TOTAL_SALES ASC ';
                console.log(statementpreparation);
                const sp = await dbConn.preparePromisified(statementpreparation);

                if (req.data.to_date < dt) {
                    SalesData = await dbConn.statementExecPromisified(sp, [req.data.minsales, req.data.percentile,req.data.from_date, req.data.to_date]);
                } else {
                    SalesData = await dbConn.statementExecPromisified(sp, [req.data.minsales, req.data.percentile,req.data.from_date, dt]);
                }
                
                
                for (let i = 0; i < SalesData.length; i++) {
                    var targetObj = new Array();
                    var targetObj = Object.assign({}, SalesData[i], req.data);
                    SalesTransData.push(targetObj);
                }

                const sQuery1 = await db.run('SELECT IFNULL(MAX("JOBID"), 0) + 1 AS JOBID FROM ICM_TRANS_CAL_DATA', []);
                var jobid = sQuery1[0]["JOBID"];

                if (SalesTransData.length > 0) {

                    for (let j = 0; j < SalesTransData.length; j++) {

                        if (dt === SalesTransData[j].to_date) {
                            SalesTransData[j].status = "Incentive Calculation Completed";
                        }
                        if (SalesTransData[j].to_date > dt) {
                            SalesTransData[j].status = "Incentive Calculation Pending";
                        }

                        const db = await cds.connect.to('db')
                         const sQuery = await db.run('CALL "prCreateTransIncentiveData" (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                             SalesTransData[j].schemeid,
                             SalesTransData[j].schemename,
                             SalesTransData[j].from_date,
                             SalesTransData[j].to_date,
                             SalesTransData[j].SKUID,
                             SalesTransData[j].REGIONCODE,
                             SalesTransData[j].SALES_AGENT,
                             SalesTransData[j].SALE_DATE,
                             SalesTransData[j].DAILY_SALES,
                             SalesTransData[j].TOTAL_SALES,
                             SalesTransData[j].minsales,
                             SalesTransData[j].percentile,
                             SalesTransData[j].TOTAL_INCENTIVE,
                             SalesTransData[j].status,
                             SalesTransData[j].icid,
                             jobid,
                             rowid,
                             dt
                         ]);
                        
                    }
                    return {SalesTransData};
                }
            } catch (error) {
                console.error(error)
                return {}
            }
        })

        return super.init();
    }

}

module.exports = { ManagerCalculation, InsentiveCommision };