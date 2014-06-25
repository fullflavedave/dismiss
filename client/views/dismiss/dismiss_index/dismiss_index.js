/*****************************************************************************/
/* DismissIndex: Event Handlers and Helpers */
/*****************************************************************************/

var htmlSections =
[
    {
        id: 'section1',
        html:
            ' <h2>I. Baseline eligibility: Were you convicted of a criminal offense?</h2><form class="form-horizontal" role="form"><div class="form-group"><label class="col-sm-2 control-label"> 1.Did you receive a prison sentence for your conviction </label><div class="col-sm-10"><div class="radio-inline"><label><input type="radio" name="q1-radios" id="q1-yes" value="true" checked> Yes </label></div><div class="radio-inline"><label><input type="radio" name="q1-radios" id="q1-no" value="false"> No </label></div></div></div><div class="form-group"><label class="col-sm-2 control-label"> 2.Were you convicted of a serious sex offense (Cal. Penal Code sections 586, 288, 288a, 288.5, 289, or 261.5) OR failing to obey a police officer (Vehicle Code section 42001) </label><div class="col-sm-10"><div class="radio-inline"><label><input type="radio" name="q2-radios" id="q2-yes" value="true" checked> Yes </label></div><div class="radio-inline"><label><input type="radio" name="q2-radios" id="q2-no" value="false"> No </label></div></div></div><div class="form-group"><label class="col-sm-2 control-label"> 3.Are you currently facing charges? </label><div class="col-sm-10"><div class="radio-inline"><label><input type="radio" name="q3-radios" id="q3-yes" value="true" checked> Yes </label></div><div class="radio-inline"><label><input type="radio" name="q3-radios" id="q3-no" value="false"> No </label></div></div></div><div class="form-group"><label class="col-sm-2 control-label"> 4.Are you currently on probation or parole? </label><div class="col-sm-10"><div class="radio-inline"><label><input type="radio" name="q4-radios" id="q4-yes" value="true" checked> Yes </label></div><div class="radio-inline"><label><input type="radio" name="q4-radios" id="q4-no" value="false"> No </label></div></div></div>'
            + createFormButtons('section1', 'section2')
            +'</form>'
    },
    {
        id: 'rehabCert',
        html:
                'You are ineligible for a dismissal. However, you MAY BE ELIGIBLE for a Certificate of Rehabilitation.'
                + '[See chart to check for eligibility for a Certificate of Rehabilitation]'
                + createFormButtons(null, 'section1')

    },
    {
        id: 'section2',
        html:
                '<h2>II. Misdemeanor or Infraction</h2><form class="form-horizontal" role="form"><div class="form-group">'
                + '<label class="col-sm-2 control-label"> Were you convicted of either a misdemeanor or an infraction? </label><div class="col-sm-10"><div class="radio-inline">'
                + '<label><input type="radio" name="q5-radios" id="q1-yes" value="true" checked> Yes </label></div><div class="radio-inline"><label><input type="radio" name="q5-radios" id="q1-no" value="false"> No </label></div></div></div>'
                + createFormButtons('section2', 'section1')
                + '</form>'

    },
    {
        id: 'section3',
        html:
                '<h2>III. Section 3</h2>'
                + '<form>'
                + createFormButtons('section3', 'section2')
                + '</form>'
    },
    {
        id: 'section4',
        html:
                '<h2>IV. Section 4</h2>'
                + '<form>'
                + createFormButtons('section3', 'section2')
                + '</form>'
    },
    {
        id: 'section5',
        html:
                '<h2>V. Section 5</h2>'
    }
];

function displayHTML(sectionID) {
    console.log('Displaying sectionID = ' + sectionID);
    for (var i=0; i < htmlSections.length; i++) {
        if (htmlSections[i].id === sectionID) {
            $('#wizard-text').html(htmlSections[i].html);
            return;
        }
    }
}

function createFormButtons(sectionID, backSectionID) {
    var htmlString =
            '<div class="form-group" style="margin-top:20px;">'
            + '<div class="col-sm-offset-2 col-sm-10">';
    if (backSectionID)
        htmlString += '<button id="back" data-back-html-id="' + backSectionID + '" type="submit" class="btn btn-default" style="margin-right: 10px;">Back</button>'
    htmlString += '<button id="start-over" type="submit" class="btn btn-default" style="margin-right: 10px;">Start Over</button>';
    if (sectionID)
        htmlString += '<button id="' + sectionID + '-submit" type="submit" class="btn btn-primary">Submit</button>';
    htmlString +=
            '</div>'
            + '</div>';
    return htmlString;
}

Template.DismissIndex.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
    'click #section1-submit': function(e, tmpl) {
        e.preventDefault();
        var a1 = $('[name="q1-radios"]:checked').val();
        var a2 = $('[name="q2-radios"]:checked').val();
        var a3 = $('[name="q3-radios"]:checked').val();
        var a4 = $('[name="q4-radios"]:checked').val();
        if(truthy(a1) || truthy(a2) || truthy(a3) || truthy(a4)) {
            console.log('rehabCert');
            displayHTML('rehabCert');
        } else {
            console.log("On to q2");
            displayHTML('section2');
        }
    },

    'click #section2-submit': function(e, tmpl) {
        e.preventDefault();
        var a5 = $('[name="q5-radios"]:checked').val();
        if(truthy(a5)) {
            console.log('section3');
            displayHTML('section3');
        } else {
            console.log('section4');
            displayHTML('section4');
        }
    },

    'click #back': function(e, tmp) {
        e.preventDefault();
        var backSectionID = $(e.currentTarget).data('back-html-id');
//        console.log('backHTMLID = ' + backSectionID);
        displayHTML(backSectionID);
    }
});


Template.DismissIndex.helpers({
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* DismissIndex: Lifecycle Hooks */
/*****************************************************************************/
Template.DismissIndex.created = function () {
};

Template.DismissIndex.rendered = function () {
    displayHTML('section1');
};

Template.DismissIndex.destroyed = function () {
};

function truthy(a) {
    if (!a || a === 'false' || a === "0") {
        return false;
    } else {
        return true;
    }
}