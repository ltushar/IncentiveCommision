using {
    cuid,
    managed
} from '@sap/cds/common';

namespace icm;


entity InsentiveConfiguration : cuid, managed {
    key ID         : UUID;
    key IID        : Integer;
        schemeid   : String(100);
        schemename : String(100);
        skuid      : String(255);
        regioncode : String(255);
        empcode    : String(255);
        minsales   : Decimal(10, 2);
        percentile : Decimal(10, 2);

}

entity InsentiveRanForDates : cuid, managed {
    key ID         : UUID;
    key ICID       : Integer;
        schemeid   : String(100);
        schemename : String(100);
        skuid      : String(255);
        regioncode : String(255);
        empcode    : String(255);
        minsales   : Decimal(10, 2);
        percentile : Decimal(10, 2);
        from_date  : Date;
        to_date    : Date;
        status     : String(10) default 'Active';

};


entity Transaction_SalesData : managed {
    skuid         : String(255);
    regioncode    : String(255);
    sales_agent   : String(100);
    actualsales   : Decimal(10, 2);
    sale_date     : Date;
    SalesOrg      : String(10);
    Districhannel : String(10);
    Division      : String(10);
    SalesOfc      : String(10);
    Desc          : String(100);
    SalesGrp      : String(10);
    SalesGrpDesc  : String(100);
    reporting_to  : String(10);
    Description1  : String(100);
    SalesDoctype  : String(20);
    Description2  : String(100);
    RefDocNo      : String(20);
    SalesDocNo    : String(20);
    SoldtoParty   : String(20);
    Description3  : String(100);
    Description4  : String(100);
    OrderQty      : String(20);
    SalesUnit     : String(20);
    Plant         : String(20);
    Currency      : String(20);
    ExchangeRate  : String(20);
    DeliveryNo    : String(20);
    DeliveryDate  : Date;
    DeliveryQuant : String(20);
    BillTypes     : String(20);
    BillNo        : String(20);
    BillDate      : Date;
    Payterms      : String(20);

}

entity Trans_Cal_data : managed {
    key cid                : Integer;
        schemeid           : String(100);
        scheme             : String(100);
        from_date          : Date;
        to_date            : Date;
        skuid              : String(255);
        regioncode         : String(255);
        sales_agent        : String(100);
        sale_date          : Date;
        daily_sales        : Decimal(10, 2);
        total_sales        : Decimal(10, 2);
        minsales           : Decimal(10, 2);
        percentile         : Decimal(10, 2);
        totalinsentive     : Decimal(10, 2);
        status             : String(100);
        isdel              : String(1) default '0';
        icid               : Integer;
        jobid              : Integer;
        rowsid             : Integer;
        createddate        : Date;
        reporting_to       : String(100);
        reporting_to_Email : String(100);
}

entity Sku_master : managed {
    key ID              : UUID;
        skucode         : String(100);
        sku_name        : String(100);
        sku_description : String(500);
        isdel           : String(1);
}

entity Region_master : managed {
    key ID          : UUID;
        region_code : String(100);
        Region_name : String(255);
        isdel       : String(1);
}

entity Org_hierarchy : managed {
    key ID                 : UUID;
        function           : String(255);
        empcode            : String(100);
        reporting_to       : String(100);
        isdel              : String(1);
        reporting_to_Email : String(100);
}

entity Employee_master : managed {
    key ID            : UUID;
        empcode       : String(100);
        empname       : String(255);
        address       : String(255);
        email         : String(100);
        contactnumber : String(100);
        designation   : String(100);
        isdel         : String(1);
}
