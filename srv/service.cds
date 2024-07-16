using {icm as my} from '../db/schema';

service InsentiveCommision @(path: '/browse') {
    entity Insentive       as projection on my.InsentiveConfiguration;
    entity InsentiveRanFor as projection on my.InsentiveRanForDates;
    entity SkuCode         as projection on my.Sku_master;
    entity Region          as projection on my.Region_master;
    entity OrgData         as projection on my.Org_hierarchy;
    entity EmpMaster       as projection on my.Employee_master;
<<<<<<< HEAD
    entity CalcData        as projection on my.Trans_Cal_data;

=======

    entity CalcData        as projection on my.Trans_Cal_data;
>>>>>>> 716334d2fc9f76ab12314be1c6c65ff32ed31e95
    action calculatedata(schemeid : String,
                         schemename : String,
                         skuid : String,
                         regioncode : String,
                         empcode : String,
                         minsales : Decimal,
                         percentile : Decimal,
                         from_date : Date,
                         to_date : Date,
                         icid : Integer) returns String;
}

service ManagerCalculation @(path: '/browse1') @(impl: './service.js') {
<<<<<<< HEAD
    entity Insentive       as projection on my.InsentiveConfiguration;
    entity InsentiveRanFor as projection on my.InsentiveRanForDates;
// entity CalcData        as projection on my.Trans_Cal_data;
// action calculatedata(schemeid : String,
//                      schemename : String,
//                      skuid : String,
//                      regioncode : String,
//                      empcode : String,
//                      minsales : Decimal,
//                      percentile : Decimal,
//                      from_date : Date,
//                      to_date : Date,
//                      icid : Integer) returns String;
=======
     entity Insentive       as projection on my.InsentiveConfiguration;
     entity InsentiveRanFor as projection on my.InsentiveRanForDates;
    // entity CalcData        as projection on my.Trans_Cal_data;
    // action calculatedata(schemeid : String,
    //                      schemename : String,
    //                      skuid : String,
    //                      regioncode : String,
    //                      empcode : String,
    //                      minsales : Decimal,
    //                      percentile : Decimal,
    //                      from_date : Date,
    //                      to_date : Date,
    //                      icid : Integer) returns String;
>>>>>>> 716334d2fc9f76ab12314be1c6c65ff32ed31e95

}

service Reporting @(path: '/report') @(impl: './reporting.js') {

    action sku_salesAgent(schemeid : String, empcode : String) returns String;
    action scheme_salesAgent(empcode : String)                 returns String;
    action regionwise_salesAgent()                             returns String;
    action schemewise_salesAgent()                             returns String;

}
