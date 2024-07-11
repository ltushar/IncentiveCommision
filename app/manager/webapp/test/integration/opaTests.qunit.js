sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'manager/test/integration/FirstJourney',
		'manager/test/integration/pages/Main'
    ],
    function(JourneyRunner, opaJourney, Main) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('manager') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheMain: Main
                }
            },
            opaJourney.run
        );
    }
);