

// =====================================================
// KALKULATOR AKTA KERJA 1955
// SCRIPT.JS
// FINAL INTEGRATION VERSION
// PART 1/4
// =====================================================



// =====================================================
// GLOBAL HELPER FUNCTION
// =====================================================



function getElement(id){

    return document.getElementById(id);

}





function setText(id,value){

    let element = getElement(id);


    if(element){

        element.innerHTML = value;

    }

}





function setValue(id,value){

    let element = getElement(id);


    if(element){

        element.value = value;

    }

}





function formatRM(value){


    value = Number(value) || 0;


    return "RM " +
    value.toLocaleString(
        "en-MY",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );


}


// =====================================================
// SHARED CALENDAR ENGINE FOUNDATION
// PATCH V2
//
// Digunakan untuk:
// - GGN Hari
// - GGN Minggu
// - Seksyen 18A
//
// Patch ini hanya menyediakan helper.
// Tiada kalkulator lama menggunakan function ini lagi.
// =====================================================



function getDaysInMonth(
    year,
    month
){


    return new Date(
        year,
        month + 1,
        0
    )
    .getDate();


}




function getMonthSalaryRate(
    salary,
    date
){


    let daysInMonth =
    getDaysInMonth(
        date.getFullYear(),
        date.getMonth()
    );


    return salary / daysInMonth;


}


// =====================================================
// SHARED MONTHLY CALCULATION ENGINE
// PATCH V2 - PART 2/5
//
// Formula:
//
// Jumlah Upah ÷ Hari Kalender Bulan
// × Hari Terlibat Dalam Bulan
//
// Sokongan:
// - Bulan sama
// - Banyak bulan
// - Lintas tahun
//
// Digunakan kemudian oleh:
// - GGN Hari
// - GGN Minggu
// - Seksyen 18A
// =====================================================



function calculateMonthlySalaryByDateRange(

    salary,

    startDate,

    endDate

){


    let total = 0;



    let current =
    new Date(startDate);



    while(
        current <= endDate
    ){



        let year =
        current.getFullYear();



        let month =
        current.getMonth();



        let daysInMonth =
        getDaysInMonth(
            year,
            month
        );



        let firstDay =
        current.getDate();



        let lastDay =
        daysInMonth;



        // Jika bulan terakhir
        if(

            year === endDate.getFullYear()
            &&
            month === endDate.getMonth()

        ){


            lastDay =
            endDate.getDate();


        }



        let daysWorked =
        lastDay
        -
        firstDay
        +
        1;



        let dailyRate =
        salary /
        daysInMonth;



        total +=
        dailyRate *
        daysWorked;



        // Pergi ke bulan berikutnya

        current =
        new Date(

            year,

            month + 1,

            1

        );



    }



    return total;


}





// =====================================================
// GET DETAIL BULANAN
//
// Digunakan jika output perlu papar:
// - Nama bulan
// - Bilangan hari
// - Kadar harian
// - Jumlah setiap bulan
// =====================================================



function getMonthlyBreakdown(

    salary,

    startDate,

    endDate

){



    let result = [];



    let current =
    new Date(startDate);



    while(
        current <= endDate
    ){



        let year =
        current.getFullYear();



        let month =
        current.getMonth();



        let daysInMonth =
        getDaysInMonth(
            year,
            month
        );



        let firstDay =
        current.getDate();



        let lastDay =
        daysInMonth;



        if(

            year === endDate.getFullYear()
            &&
            month === endDate.getMonth()

        ){


            lastDay =
            endDate.getDate();


        }



        let days =
        lastDay
        -
        firstDay
        +
        1;



        let dailyRate =
        salary /
        daysInMonth;



        let amount =
        dailyRate *
        days;



        result.push({

            year:year,

            month:month,

            daysInMonth:daysInMonth,

            days:days,

            dailyRate:dailyRate,

            amount:amount

        });



        current =
        new Date(

            year,

            month + 1,

            1

        );


    }



    return result;


}



// =====================================================
// INPUT FORMULA ENGINE
// SUPPORT:
// 2500
// 2500+300
// 2500+300+200
// =====================================================



function calculateInput(value){



    if(!value){

        return 0;

    }



    try{


        return Function(
            "return " + value
        )();



    }
    catch(error){


        return 0;


    }


}









function getInputNumber(id){



    let element =
    getElement(id);



    if(!element){

        return 0;

    }



    return calculateInput(
        element.value
    );


}


// =====================================================
// GLOBAL SALARY TOTAL ENGINE V3
//
// Formula:
// Gaji Pokok + Elaun
//
// Digunakan oleh:
// - ORP
// - OT Biasa
// - OT Hari Rehat
// - Seksyen 18A
// - GGN
// - GGN Day
// - Kalkulator masa depan
// =====================================================



function updateSalaryTotal(
    basicID,
    allowanceID,
    totalID
){


    let basic =
    getInputNumber(
        basicID
    );



    let allowance =
    getInputNumber(
        allowanceID
    );



    let total =
    basic + allowance;



    setValue(
        totalID,
        formatRM(total)
    );


    return total;

}





// =====================================================
// SALARY FIELD MAP
//
// Tambah kalkulator baru hanya di sini
// =====================================================



const salaryMap = {


    // ORP

    "orpBasicSalary":[
        "orpAllowance",
        "orpTotalSalary"
    ],



    // OT BIASA

    "otBasicSalary":[
        "otAllowance",
        "otTotalSalary"
    ],



    // OT HARI REHAT

    "otRHBasicSalary":[
        "otRHAllowance",
        "otRHTotalSalary"
    ],



    // SEKSYEN 18A

    "section18ABasicSalary":[
        "section18AAllowance",
        "section18ATotalSalary"
    ],



    // GGN LAMA

    "ggnBasicSalary":[
        "ggnAllowance",
        "ggnTotalSalary"
    ],



    // GGN DAY BARU

    "ggnDaySalary":[
        "ggnDayAllowance",
        "ggnDayTotalSalary"
    ],



    // HARI REHAT

    "rhBasicSalary":[
        "rhAllowance",
        "rhTotalSalary"
    ],



    // HARI REHAT LEBIH 1/2

    "rhMoreBasicSalary":[
        "rhMoreAllowance",
        "rhMoreTotalSalary"
    ],



    // HARI KELEPASAN

    "phBasicSalary":[
        "phAllowance",
        "phTotalSalary"
    ],



    // OT HARI KELEPASAN

    "otPHBasicSalary":[
        "otPHAllowance",
        "otPHTotalSalary"
    ]

};







// =====================================================
// AUTO UPDATE SALARY ENGINE
// =====================================================


document.addEventListener(
"input",
function(event){



    let id =
    event.target.id;



    Object.keys(
        salaryMap
    )
    .forEach(
    function(key){



        let data =
        salaryMap[key];



        if(
            id === key ||
            id === data[0]
        ){



            updateSalaryTotal(

                key,

                data[0],

                data[1]

            );


        }



    });



});







// =====================================================
// KALKULATOR ORP (KADAR UPAH BIASA)
// FORMULA:
// (GAJI POKOK + ELAUN) ÷ 26
// =====================================================


function calculateORP(){



    // ==============================
    // KIRA JUMLAH UPAH
    // ==============================


    let totalSalary =
    updateSalaryTotal(
        "orpBasicSalary",
        "orpAllowance",
        "orpTotalSalary"
    );



    // ==============================
    // KIRA ORP
    // ==============================


    let ORP =
    totalSalary / 26;



    // ==============================
    // PAPAR KEPUTUSAN
    // ==============================


    setText(
        "orpResultTotal",
        formatRM(totalSalary)
    );



    setText(
        "orpResult",
        formatRM(ORP)
    );



    // ==============================
    // SIMPAN UNTUK GGN / CUTI
    // ==============================


    localStorage.setItem(
        "ORP",
        ORP.toFixed(2)
    );


}

function resetORP(){


    setValue(
        "orpBasicSalary",
        ""
    );


    setValue(
        "orpAllowance",
        ""
    );


    setValue(
        "orpTotalSalary",
        "RM 0.00"
    );



    setText(
        "orpResultTotal",
        "RM 0.00"
    );



    setText(
        "orpResult",
        "RM 0.00"
    );



    localStorage.removeItem(
        "ORP"
    );


}

// =====================================================
// SCRIPT.JS
// FINAL INTEGRATION VERSION
// PART 2/4
// =====================================================


// =====================================================
// KALKULATOR ORP
// FORMULA:
// (GAJI POKOK + ELAUN) ÷ 26
// =====================================================

function calculateORP(){


    let totalSalary =
    updateSalaryTotal(
        "orpBasicSalary",
        "orpAllowance",
        "orpTotalSalary"
    );



    let ORP =
    totalSalary / 26;



    // ==============================
    // PAPAR KEPUTUSAN
    // ==============================


    setText(
        "orpResultTotal",
        formatRM(totalSalary)
    );


    setText(
        "orpResult",
        formatRM(ORP)
    );



    // ==============================
    // SIMPAN ORP UNTUK GGN
    // ==============================

    localStorage.setItem(
        "ORP",
        ORP.toFixed(2)
    );


}




// =====================================================
// KALKULATOR OT HARI BIASA
// =====================================================


function calculateOTBiasa(){


    let totalSalary =
    updateSalaryTotal(
        "otBasicSalary",
        "otAllowance",
        "otTotalSalary"
    );


    let hours =
    Number(
        getElement("otHours").value
    );


    let workingHours =
    Number(
        getElement("normalWorkingHours").value
    );


    if(!workingHours){

        alert(
            "Sila pilih jam kerja normal sehari."
        );

        return;

    }


    let ORP =
    totalSalary / 26;


    // Kadar sejam selepas darab 1.5
    let normalHourly =
    ORP / workingHours;


    let hourly =
    normalHourly * 1.5;


    let amount =
    hourly * hours;



    setText(
        "otResultTotal",
        formatRM(totalSalary)
    );


    setText(
        "otORP",
        formatRM(ORP)
    );


    setText(
        "otHourly",
        formatRM(hourly)
    );


    setText(
        "otAmount",
        formatRM(amount)
    );


}







function resetOTBiasa(){



    [
        "otBasicSalary",
        "otAllowance",
        "otHours"

    ]
    .forEach(
        id=>setValue(id,"")
    );



    setValue(
        "otTotalSalary",
        "RM 0.00"
    );



    setValue(
        "normalWorkingHours",
        ""
    );



    [
        "otResultTotal",
        "otORP",
        "otHourly",
        "otAmount"

    ]
    .forEach(
        id=>setText(id,"RM 0.00")
    );


}



// =====================================================
// KALKULATOR OT HARI REHAT
// =====================================================


function calculateOTRH(){


    let totalSalary =
    updateSalaryTotal(
        "otRHBasicSalary",
        "otRHAllowance",
        "otRHTotalSalary"
    );


    let hours =
    Number(
        getElement("otRHHours").value
    );


    let workingHours =
    Number(
        getElement("otRHNormalWorkingHours").value
    );


    if(!workingHours){

        alert(
            "Sila pilih jam kerja normal sehari."
        );

        return;

    }



    let ORP =
    totalSalary / 26;


    let normalHourly =
    ORP / workingHours;


    // Kadar sejam selepas x2.0
    let hourly =
    normalHourly * 2.0;


    let amount =
    hourly * hours;



    setText(
        "otRHResultTotal",
        formatRM(totalSalary)
    );


    setText(
        "otRHORP",
        formatRM(ORP)
    );


    setText(
        "otRHHourly",
        formatRM(hourly)
    );


    setText(
        "otRHAmount",
        formatRM(amount)
    );


}








function resetOTRH(){



    [
        "otRHBasicSalary",
        "otRHAllowance",
        "otRHHours"

    ]
    .forEach(
        id=>setValue(id,"")
    );



    setValue(
        "otRHTotalSalary",
        "RM 0.00"
    );



    setValue(
        "otRHNormalWorkingHours",
        ""
    );



    [
        "otRHResultTotal",
        "otRHORP",
        "otRHHourly",
        "otRHAmount"

    ]
    .forEach(
        id=>setText(id,"RM 0.00")
    );


}











// =====================================================
// KALKULATOR KERJA HARI REHAT
// 1/2 HARI @ KURANG
// =====================================================



function calculateHariRehat(){



    let totalSalary =
    updateSalaryTotal(
        "rhBasicSalary",
        "rhAllowance",
        "rhTotalSalary"
    );



    let days =
    Number(
        getElement(
            "rhDays"
        ).value
    );



let ORP =
totalSalary / 26;


let daily =
ORP * 0.5;


let amount =
daily * days;




    setText(
        "rhResultTotal",
        formatRM(totalSalary)
    );


    setText(
        "rhORP",
        formatRM(ORP)
    );


    setText(
        "rhDaily",
        formatRM(daily)
    );


    setText(
        "rhAmount",
        formatRM(amount)
    );


}









function resetHariRehat(){



    [
        "rhBasicSalary",
        "rhAllowance",
        "rhDays"

    ]
    .forEach(
        id=>setValue(id,"")
    );



    setValue(
        "rhTotalSalary",
        "RM 0.00"
    );



    [
        "rhResultTotal",
        "rhORP",
        "rhDaily",
        "rhAmount"

    ]
    .forEach(
        id=>setText(id,"RM 0.00")
    );


}












// =====================================================
// KALKULATOR KERJA HARI REHAT
// LEBIH 1/2 HARI
// =====================================================



function calculateHariRehatLebih(){



    let totalSalary =
    updateSalaryTotal(
        "rhMoreBasicSalary",
        "rhMoreAllowance",
        "rhMoreTotalSalary"
    );



    let days =
    Number(
        getElement(
            "rhMoreDays"
        ).value
    );



    let ORP =
    totalSalary / 26;



    let daily =
    ORP;



    let amount =
    daily * days;







    setText(
        "rhMoreResultTotal",
        formatRM(totalSalary)
    );



    setText(
        "rhMoreORP",
        formatRM(ORP)
    );



    setText(
        "rhMoreDaily",
        formatRM(daily)
    );



    setText(
        "rhMoreAmount",
        formatRM(amount)
    );


}









function resetHariRehatLebih(){



    [
        "rhMoreBasicSalary",
        "rhMoreAllowance",
        "rhMoreDays"

    ]
    .forEach(
        id=>setValue(id,"")
    );



    setValue(
        "rhMoreTotalSalary",
        "RM 0.00"
    );



    [
        "rhMoreResultTotal",
        "rhMoreORP",
        "rhMoreDaily",
        "rhMoreAmount"

    ]
    .forEach(
        id=>setText(id,"RM 0.00")
    );


}
// =====================================================
// SCRIPT.JS
// FINAL INTEGRATION VERSION
// PART 3/4
// =====================================================


// =====================================================
// KALKULATOR GAJI GANTI NOTIS (BULAN)
//
// Input:
// Bilangan Bulan
//
// Sumber Upah:
// ORP Calculator
//
// Formula:
// Jumlah Upah x Bilangan Bulan
// =====================================================


function calculateGGNMonth(){

    let totalSalary =
    getInputNumber(
        "orpBasicSalary"
    )
    +
    getInputNumber(
        "orpAllowance"
    );


    let months =
    Number(
        getElement(
            "ggnMonthNotice"
        ).value
    );


    if(!months){

        alert(
            "Sila masukkan bilangan bulan notis."
        );

        return;

    }


    let amount =
    totalSalary *
    months;


    setText(
        "ggnResultType",
        "Bulan"
    );


    setText(
        "ggnResultMonth",
        months + " Bulan"
    );


    setText(
        "ggnAmount",
        formatRM(amount)
    );

}



// =====================================================
// RESET KALKULATOR GAJI GANTI NOTIS
// RESET SEMUA FIELD GGN
// =====================================================


function resetGGN(){


    // =========================
    // RESET INPUT
    // =========================


    [

        "ggnBasicSalary",
        "ggnAllowance",
        "ggnTotalSalary",
        "ggnNoticeType",
        "ggnMonthNotice",
        "ggnNoticePeriod",
        "ggnStartDate",
        "ggnEndDate"

    ]
    .forEach(
        function(id){

            let element =
            document.getElementById(id);


            if(element){

                element.value = "";

            }

        }
    );



    // =========================
    // RESET KEPUTUSAN
    // =========================


    [

        "ggnResultType",
        "ggnResultMonth",
        "ggnNoticeDays",
        "ggnAmount"

    ]
    .forEach(
        function(id){

            let element =
            document.getElementById(id);


            if(element){

                if(id === "ggnResultType"){

                    element.innerHTML = "-";

                }


                else if(id === "ggnResultMonth"){

                    element.innerHTML = "0 Bulan";

                }


                else if(id === "ggnNoticeDays"){

                    element.innerHTML = "0 Hari";

                }


                else if(id === "ggnAmount"){

                    element.innerHTML = "RM 0.00";

                }

            }

        }
    );


}

// =====================================================
// KALKULATOR SEKSYEN 18A
// FORMULA:
// JUMLAH UPAH ÷ HARI KALENDAR BULAN
// SETIAP BULAN DIKIRA BERASINGAN
// =====================================================


function calculate18A(){


    let totalSalary =
    updateSalaryTotal(
        "section18ABasicSalary",
        "section18AAllowance",
        "section18ATotalSalary"
    );




    let startDate =
    getElement(
        "section18AStartDate"
    ).value;



    let endDate =
    getElement(
        "section18AEndDate"
    ).value;




    if(
        !startDate ||
        !endDate
    ){

        alert(
            "Sila masukkan tarikh mula dan tarikh akhir."
        );

        return;

    }





    let start =
    new Date(startDate);



    let end =
    new Date(endDate);





    if(end < start){


        alert(
            "Tarikh akhir tidak boleh lebih awal daripada tarikh mula."
        );


        return;

    }





    // ==========================================
    // DATA BULAN PERTAMA
    // ==========================================


    let startYear =
    start.getFullYear();



    let startMonth =
    start.getMonth();



    let month1CalendarDays =
    new Date(
        startYear,
        startMonth + 1,
        0
    )
    .getDate();




    let month1Days = 0;



    let month1Amount = 0;



    let month1DailyRate =
    totalSalary /
    month1CalendarDays;





    // ==========================================
    // DATA BULAN KEDUA
    // ==========================================


    let month2Days = 0;

    let month2Amount = 0;

    let month2CalendarDays = 0;

    let month2DailyRate = 0;





    let endYear =
    end.getFullYear();



    let endMonth =
    end.getMonth();






    // ==========================================
    // BULAN YANG SAMA
    // ==========================================


    if(
        startYear === endYear &&
        startMonth === endMonth
    ){



        month1Days =
        end.getDate()
        -
        start.getDate()
        +
        1;




        month1Amount =
        month1DailyRate *
        month1Days;



    }





    // ==========================================
    // MELIBATKAN 2 BULAN
    // ==========================================


    else{



        // Bulan pertama

        month1Days =
        month1CalendarDays
        -
        start.getDate()
        +
        1;




        month1Amount =
        month1DailyRate *
        month1Days;






        // Bulan kedua


        month2CalendarDays =
        new Date(
            endYear,
            endMonth + 1,
            0
        )
        .getDate();




        month2DailyRate =
        totalSalary /
        month2CalendarDays;




        month2Days =
        end.getDate();




        month2Amount =
        month2DailyRate *
        month2Days;



    }






    let totalAmount =
    month1Amount +
    month2Amount;








    // ==========================================
    // OUTPUT JUMLAH UPAH
    // ==========================================


    setText(
        "resultTotalSalary",
        formatRM(totalSalary)
    );







    // ==========================================
    // OUTPUT BULAN PERTAMA
    // ==========================================


    setText(
        "month1Title",
        start.toLocaleString(
            "ms-MY",
            {
                month:"long",
                year:"numeric"
            }
        )
    );




    setText(
        "month1Days",
        month1Days + " Hari"
    );




    setText(
        "month1Daily",
        formatRM(month1DailyRate)
    );




    setText(
        "month1Amount",
        formatRM(month1Amount)
    );








    // ==========================================
    // OUTPUT BULAN KEDUA
    // ==========================================


    if(
        month2Days > 0
    ){



        setText(
            "month2Title",
            end.toLocaleString(
                "ms-MY",
                {
                    month:"long",
                    year:"numeric"
                }
            )
        );



        setText(
            "month2Days",
            month2Days + " Hari"
        );



        setText(
            "month2Daily",
            formatRM(month2DailyRate)
        );



        setText(
            "month2Amount",
            formatRM(month2Amount)
        );



    }

    else{


        setText(
            "month2Title",
            "-"
        );


        setText(
            "month2Days",
            "-"
        );


        setText(
            "month2Daily",
            "-"
        );


        setText(
            "month2Amount",
            "-"
        );


    }







    // ==========================================
    // JUMLAH BAYARAN UPAH
    // ==========================================


    setText(
        "amount18A",
        formatRM(totalAmount)
    );



}






// =====================================================
// RESET SEKSYEN 18A
// =====================================================


function resetSeksyen18A(){



    [

        "section18ABasicSalary",
        "section18AAllowance",
        "section18AStartDate",
        "section18AEndDate"

    ]
    .forEach(
        id=>setValue(id,"")
    );





    setValue(
        "section18ATotalSalary",
        "RM 0.00"
    );






    [

        "resultTotalSalary",
        "month1Daily",
        "month2Daily",
        "month1Amount",
        "month2Amount",
        "amount18A"

    ]
    .forEach(
        id=>setText(
            id,
            "RM 0.00"
        )
    );







    [

        "month1Title",
        "month2Title",
        "month1Days",
        "month2Days"

    ]
    .forEach(
        id=>setText(
            id,
            "-"
        )
    );


}

// =====================================================
// KALKULATOR SEKSYEN 18A
// PATCH V2 - PART 4/5
//
// NEW ENGINE VERSION
//
// Menggunakan:
// getMonthlyBreakdown()
//
// Sokongan:
// - Bulan sama
// - Banyak bulan
// - Lintas tahun
//
// Function lama:
// calculate18A()
//
// Dikekalkan sebagai backup.
// =====================================================



function calculate18ANew(){



    let totalSalary =

    updateSalaryTotal(

        "section18ABasicSalary",

        "section18AAllowance",

        "section18ATotalSalary"

    );





    let startDate =

    getElement(
        "section18AStartDate"
    ).value;





    let endDate =

    getElement(
        "section18AEndDate"
    ).value;





    if(

        !startDate ||

        !endDate

    ){

        alert(
            "Sila masukkan tarikh mula dan tarikh akhir."
        );

        return;

    }





    let start =

    new Date(
        startDate
    );





    let end =

    new Date(
        endDate
    );





    if(
        end < start
    ){

        alert(
            "Tarikh akhir tidak boleh lebih awal daripada tarikh mula."
        );

        return;

    }





    let breakdown =

    getMonthlyBreakdown(

        totalSalary,

        start,

        end

    );





    let totalAmount = 0;



    breakdown.forEach(

        item => {

            totalAmount +=
            item.amount;

        }

    );





    // ==========================================
    // OUTPUT JUMLAH UPAH
    // ==========================================


    setText(

        "resultTotalSalary",

        formatRM(totalSalary)

    );





    // ==========================================
    // OUTPUT BULAN PERTAMA
    // ==========================================


    if(
        breakdown.length > 0
    ){



        let first =

        breakdown[0];



        let firstDate =

        new Date(

            first.year,

            first.month,

            1

        );



        setText(

            "month1Title",

            firstDate.toLocaleString(

                "ms-MY",

                {

                    month:"long",

                    year:"numeric"

                }

            )

        );



        setText(

            "month1Days",

            first.days + " Hari"

        );



        setText(

            "month1Daily",

            formatRM(first.dailyRate)

        );



        setText(

            "month1Amount",

            formatRM(first.amount)

        );


    }





    // ==========================================
    // OUTPUT BULAN KEDUA
    // ==========================================


    if(
        breakdown.length > 1
    ){



        let second =

        breakdown[1];



        let secondDate =

        new Date(

            second.year,

            second.month,

            1

        );



        setText(

            "month2Title",

            secondDate.toLocaleString(

                "ms-MY",

                {

                    month:"long",

                    year:"numeric"

                }

            )

        );



        setText(

            "month2Days",

            second.days + " Hari"

        );



        setText(

            "month2Daily",

            formatRM(second.dailyRate)

        );



        setText(

            "month2Amount",

            formatRM(second.amount)

        );



    }





    setText(

        "amount18A",

        formatRM(totalAmount)

    );



}

// =====================================================
// KALKULATOR GAJI GANTI NOTIS (GGN)
// =====================================================
// HTML ID REQUIRED:
//
// ggnStartDate
// ggnEndDate
// ggnNoticeType
// ggnNoticePeriod
// ggnNoticeDays
// ggnAmount
//
// =====================================================


function calculateGGN(){



    let totalSalary =
    updateSalaryTotal(
        "ggnBasicSalary",
        "ggnAllowance",
        "ggnTotalSalary"
    );





    let type =
    getElement(
        "ggnNoticeType"
    ).value;




    let period =
    Number(
        getElement(
            "ggnNoticePeriod"
        ).value
    );




    let startDate =
    getElement(
        "ggnStartDate"
    ).value;





    if(
        !type ||
        !period
    ){

        alert(
            "Sila pilih jenis notis dan masukkan tempoh notis."
        );

        return;

    }





    if(
        !startDate
    ){

        alert(
            "Sila masukkan Tarikh Mula Notis."
        );

        return;

    }





    let start =
    new Date(startDate);





    let end =
    new Date(start);





    let totalDays = 0;

    let amount = 0;





    // =====================================================
    // NOTIS BULAN
    // Formula:
    // Jumlah Upah x Bilangan Bulan
    // =====================================================


    if(
        type === "month"
    ){



        end.setMonth(
            end.getMonth() + period
        );



        end.setDate(
            end.getDate() - 1
        );



        totalDays =
        Math.ceil(
            (
                end - start
            )
            /
            (1000*60*60*24)
        )
        +
        1;




        amount =
        totalSalary *
        period;



    }





    // =====================================================
    // NOTIS MINGGU
    // =====================================================


    else if(
        type === "week"
    ){



        totalDays =
        period * 7;




        end.setDate(
            end.getDate()
            +
            totalDays
            -
            1
        );



        amount =
        calculateGGNByMonth(
            totalSalary,
            start,
            end
        );


    }





    // =====================================================
    // NOTIS HARI
    // =====================================================


    else if(
        type === "day"
    ){



        totalDays =
        period;




        end.setDate(
            end.getDate()
            +
            totalDays
            -
            1
        );



        amount =
        calculateGGNByMonth(
            totalSalary,
            start,
            end
        );


    }







    // =====================================================
    // OUTPUT
    // =====================================================



    setValue(
        "ggnEndDate",
        formatDateInput(end)
    );




    setText(
        "ggnNoticeDays",
        totalDays + " Hari"
    );




    setText(
        "ggnAmount",
        formatRM(amount)
    );



}









// =====================================================
// KIRA GGN IKUT BULAN
// =====================================================


function calculateGGNByMonth(
    salary,
    start,
    end
){



    let total = 0;



    let current =
    new Date(start);





    while(
        current <= end
    ){



        let year =
        current.getFullYear();



        let month =
        current.getMonth();




        let monthDays =
        new Date(
            year,
            month + 1,
            0
        )
        .getDate();





        let firstDay =
        current.getDate();





        let lastDay =
        monthDays;





        if(
            year === end.getFullYear()
            &&
            month === end.getMonth()
        ){


            lastDay =
            end.getDate();


        }






        let days =
        lastDay -
        firstDay
        +
        1;






        let dailyRate =
        salary /
        monthDays;





        total +=
        dailyRate *
        days;






        current =
        new Date(
            year,
            month + 1,
            1
        );



    }





    return total;



}
// =====================================================
// KALKULATOR GAJI GANTI NOTIS (HARI)
// FINAL CLEAN VERSION
// =====================================================


function updateGGNDayTotalSalary(){

    updateSalaryTotal(
        "ggnDaySalary",
        "ggnDayAllowance",
        "ggnDayTotalSalary"
    );

}




function autoGGNDayEndDate(){

    let start =
    getElement("ggnDayStartDate");


    let days =
    getElement("ggnDayNoticeDays");


    let end =
    getElement("ggnDayEndDate");


    if(
        !start ||
        !days ||
        !end
    ){

        return;

    }



    if(
        !start.value ||
        Number(days.value)<=0
    ){

        end.value="";

        return;

    }



    let date =
    new Date(start.value);



    date.setDate(
        date.getDate()
        +
        Number(days.value)
        -
        1
    );


    end.value =
    formatDateInput(date);


}






function calculateGGNDay(){


    
    let totalSalary =
    updateSalaryTotal(
        "ggnDaySalary",
        "ggnDayAllowance",
        "ggnDayTotalSalary"
    );



    let days =
    Number(
        getElement("ggnDayNoticeDays").value
    );



    let startDate =
    getElement("ggnDayStartDate").value;

console.log(
    "GGN DAY CHECK:",
    {
        totalSalary: totalSalary,
        days: days,
        startDate: startDate
    }
);

    if(
        !startDate ||
        days<=0
    ){

        alert(
            "Sila masukkan bilangan hari dan Tarikh Mula Notis."
        );

        return;

    }



    let start =
    new Date(startDate);



    let end =
    new Date(start);



    end.setDate(
        end.getDate()
        +
        days
        -
        1
    );



    let amount =
    calculateMonthlySalaryByDateRange(
        totalSalary,
        start,
        end
    );

console.log(
    "GGN DAY AMOUNT:",
    amount
);

    setValue(
        "ggnDayEndDate",
        formatDateInput(end)
    );
setText(
    "ggnDayResultEndDate",
    end.toLocaleDateString("ms-MY")
);

setText(
    "ggnDayResultDays",
    days+" Hari"
);


setText(
    "ggnDayAmount",
    formatRM(amount)
);

console.log(
    "OUTPUT CHECK:",
    getElement("ggnDayAmount").value
);
}





function resetGGNDay(){


    [
        "ggnDaySalary",
        "ggnDayAllowance",
        "ggnDayStartDate",
        "ggnDayEndDate"
    ]
    .forEach(
        id=>setValue(id,"")
    );


    setValue(
        "ggnDayNoticeDays",
        "1"
    );


    setValue(
        "ggnDayTotalSalary",
        "RM 0.00"
    );



    setText(
    "ggnDayResultDays",
    "0 Hari"
);


setText(
    "ggnDayResultEndDate",
    "-"
);


setText(
    "ggnDayAmount",
    "RM 0.00"
);
}

// =====================================================
// KALKULATOR CUTI TAHUNAN
// =====================================================



function calculateCutiTahunan(){



    let ORP =
    getORP();



    let days =
    Number(
        getElement(
            "annualLeaveDays"
        ).value
    );





    let amount =
    ORP * days;





    setText(
        "annualLeaveORP",
        formatRM(ORP)
    );



    setText(
        "annualLeaveAmount",
        formatRM(amount)
    );



}









function resetCutiTahunan(){



    setValue(
        "annualLeaveDays",
        ""
    );



    setText(
        "annualLeaveORP",
        "RM 0.00"
    );



    setText(
        "annualLeaveAmount",
        "RM 0.00"
    );


}











// =====================================================
// KALKULATOR CUTI SAKIT
// =====================================================



function calculateCutiSakit(){



    let ORP =
    getORP();



    let days =
    Number(
        getElement(
            "sickLeaveDays"
        ).value
    );





    let amount =
    ORP * days;





    setText(
        "sickLeaveORP",
        formatRM(ORP)
    );



    setText(
        "sickLeaveAmount",
        formatRM(amount)
    );



}









function resetCutiSakit(){



    setValue(
        "sickLeaveDays",
        ""
    );



    setText(
        "sickLeaveORP",
        "RM 0.00"
    );



    setText(
        "sickLeaveAmount",
        "RM 0.00"
    );


}
// ===================================================== // GET ORP CURRENT VALUE // DIGUNAKAN OLEH CUTI // =====================================================

function getORP(){ let totalSalary = updateSalaryTotal( "orpBasicSalary", "orpAllowance", "orpTotalSalary" ); return totalSalary / 26; }








// =====================================================
// KALKULATOR KERJA PADA HARI KELEPASAN
// =====================================================



function calculatePH(){



    let totalSalary =
    updateSalaryTotal(
        "phBasicSalary",
        "phAllowance",
        "phTotalSalary"
    );





    let days =
    Number(
        getElement(
            "phDays"
        ).value
    );




let ORP =
totalSalary / 26;


let daily =
ORP * 2;


let amount =
daily *
days;






    setText(
        "phResultTotal",
        formatRM(totalSalary)
    );



    setText(
        "phORP",
        formatRM(ORP)
    );



    setText(
        "phDaily",
        formatRM(daily)
    );



    setText(
        "phAmount",
        formatRM(amount)
    );



}









function resetPH(){



    [

        "phBasicSalary",
        "phAllowance",
        "phDays"

    ]
    .forEach(
        id=>setValue(id,"")
    );





    setValue(
        "phTotalSalary",
        "RM 0.00"
    );





    [

        "phResultTotal",
        "phORP",
        "phDaily",
        "phAmount"

    ]
    .forEach(
        id=>setText(id,"RM 0.00")
    );



}











// =====================================================
// KALKULATOR OT HARI KELEPASAN
// =====================================================



function calculateOTPH(){



    let totalSalary =
    updateSalaryTotal(
        "otPHBasicSalary",
        "otPHAllowance",
        "otPHTotalSalary"
    );





    let hours =
    Number(
        getElement(
            "otPHHours"
        ).value
    );





    let workingHours =
    Number(
        getElement(
            "otPHWorkingHours"
        ).value
    );





    if(!workingHours){


        alert(
            "Sila pilih jam kerja normal sehari."
        );


        return;

    }






   let ORP =
totalSalary / 26;

// Kadar sejam biasa
let normalHourly =
ORP /
workingHours;

// Kadar sejam OT Hari Kelepasan (×3.0)
let hourly =
normalHourly * 3.0;

// Jumlah OT
let amount =
hourly *
hours;








    setText(
        "otPHResultTotal",
        formatRM(totalSalary)
    );



    setText(
        "otPHORP",
        formatRM(ORP)
    );



    setText(
        "otPHHourly",
        formatRM(hourly)
    );



    setText(
        "otPHAmount",
        formatRM(amount)
    );



}









function resetOTPH(){



    [

        "otPHBasicSalary",
        "otPHAllowance",
        "otPHHours"

    ]
    .forEach(
        id=>setValue(id,"")
    );






    setValue(
        "otPHTotalSalary",
        "RM 0.00"
    );






    setValue(
        "otPHWorkingHours",
        ""
    );






    [

        "otPHResultTotal",
        "otPHORP",
        "otPHHourly",
        "otPHAmount"

    ]
    .forEach(
        id=>setText(id,"RM 0.00")
    );



}


// =====================================================
// FORMAT TARIKH INPUT
// YYYY-MM-DD
// =====================================================

function formatDateInput(date){

    let year = date.getFullYear();

    let month = String(
        date.getMonth() + 1
    ).padStart(2,"0");

    let day = String(
        date.getDate()
    ).padStart(2,"0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// =====================================================
// KALKULATOR GAJI GANTI NOTIS (MINGGU)
// FINAL PROFESSIONAL ARCHITECTURE V3
// =====================================================

function calculateGGNWeek(){

    let totalSalary =
    updateSalaryTotal(
        "ggnWeekBasicSalary",
        "ggnWeekAllowance",
        "ggnWeekTotalSalary"
    );

    let minggu =
    Number(
        getElement("ggnWeekNotice").value
    );

    let startDate =
    getElement("ggnWeekStartDate").value;

    if(
        minggu <= 0 ||
        !startDate
    ){
        alert(
            "Sila masukkan bilangan minggu dan Tarikh Mula Notis."
        );
        return;
    }

    let jumlahHari =
    minggu * 7;

    let start =
    new Date(startDate);

    let end =
    new Date(start);

    end.setDate(
        end.getDate() + jumlahHari - 1
    );

    let bayaranGGN =
    calculateMonthlySalaryByDateRange(
        totalSalary,
        start,
        end
    );

    setValue(
        "ggnWeekEndDate",
        formatDateInput(end)
    );

    setText(
        "ggnWeekDays",
        jumlahHari + " Hari"
    );

    setText(
        "ggnWeekResultEndDate",
        end.toLocaleDateString("ms-MY")
    );

    setText(
        "ggnWeekAmount",
        formatRM(bayaranGGN)
    );

}
// =====================================================
// FINAL SAFETY CHECK
// PATCH V2 - PART 5/5
//
// Memastikan function baharu hanya berjalan
// jika HTML element wujud.
//
// Tidak mengganggu kalkulator lama.
// =====================================================



function safeRun(functionName){


    if(
        typeof window[functionName]
        ===
        "function"
    ){

        return true;

    }


    return false;


}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener(
"DOMContentLoaded",
function(){

    // Tiada initialization diperlukan buat masa ini.

});
