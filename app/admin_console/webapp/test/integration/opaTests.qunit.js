sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'adminconsole/test/integration/FirstJourney',
		'adminconsole/test/integration/pages/InsentiveMain'
    ],
    function(JourneyRunner, opaJourney, InsentiveMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('adminconsole') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheInsentiveMain: InsentiveMain
                }
            },
            opaJourney.run
        );
    }
);