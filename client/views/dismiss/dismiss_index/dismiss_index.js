/*****************************************************************************/
/* DismissIndex: Event Handlers and Helpers */
/*****************************************************************************/

var answers = [];
var history = [];
var pages = {
    p1: {
        title: 'I. Baseline Eligibility',
        questions: {
            q0: 'Did you receive a prison sentence for your conviction?',
            q1: 'Were you convicted of a serious sex offense (Cal. Penal Code sections 586, 288, 288a, 288.5, 289, or 261.5) OR failing to obey a police officer (Vehicle Code section 42001)?',
            q2: 'Are you currently facing charges?',
            q3: 'Are you currently on probation or parole?',

        },
        yesPage: 'rehabCert',
        noPage: 'p2'
    },
    rehabCert: {
        title: 'Ineligible',
        text:  'You are ineligible for a dismissal. However, you MAY BE ELIGIBLE for a Certificate of Rehabilitation.' +
               '[See chart to check for eligibility for a Certificate of Rehabilitation]'
    },
    p2: {
        title: 'II. Misdemeanor or Infraction',
        questions: {
            q4: 'Were you convicted of either a misdemeanor or an infraction?'
        },
        yesPage: 'p3',
        noPage: 'p4'
    },
    p3: {
        title: 'III. Probation',
        questions: {
            q5: 'If you were convicted of a misdemeanor, did you receive probation?'
        },
        yesPage: 'p4',
        noPage: 'p3a'
    },
    p3a: {
        title: 'III.a. Probation Fines and Fees',
        questions: {
            q6: 'If you did not receive probation, did you pay off all your court fines and fees?'
        },
        yesPage: 'p3b',
        noPage: 'p4'
    },
    p3b: {
        title: 'III.b. One Year Past',
        questions: {
            q7: 'If you paid off all your fines and fees, has it been a year since the date of your conviction?'
        },
        yesPage: 'eligible12034a',
        noPage: 'mayQualify12034'
    },
    eligible12034a: {
        title: 'Eligible',
        text: 'YOU ARE ELIGIBLE for a mandatory 1203.4a dismissal. Fill out form CR-180 to begin the filing process for your petition. [link to form CR-180.]'
    },
    mayQualify12034: {
        title: 'Discretionary Dismissal',
        text: 'YOU MAY QUALIFY for a discretionary 1203.4 dismissal. Fill out form CR-180 to begin the filing process for your petition. [link to form CR-180.] ' +
              'or consider waiting out the one year period for a mandatory dismissal.'
    },
    p4: {
        title: 'IV. Probation Violation',
        questions: {
            q8: 'If you were sentenced to probation for your misdemeanor OR felony conviction, did you violate the terms of your probation?'
        },
        yesPage: 'p4a',
        noPage: 'seemsWrong'
    },
    p4a: {
        title: '1203.4 Dismissal',
        text: 'YOU MAY QUALIFY for a discretionary 1203.4 dismissal. Fill out form CR-180 to begin the filing process for your petition. [link to form CR-180.]' +
            'If you were convicted of a felony, go on to <a href="#" id="linkTo5">question V</a> to see if you are eligible for a 17(b) felony reduction.'
    },
    seemsWrong: {
        title: '1203.4 Dismissal',
        text: 'YOU MAY QUALIFY for a discretionary 1203.4 dismissal. Fill out form CR-180 to begin the filing process for your petition. [link to form CR-180.]' +
                'If you were convicted of a felony, go on to <a href="#" id="linkTo5">question V</a> to see if you are eligible for a 17(b) felony reduction.'
    },
    p5: {
      title: 'V. Felony Wobbler',
        questions: {
            q9: 'Were you convicted of a felony wobbler? [A wobbler conviction is a conviction that is punishable as a felony OR a misdemeanor.]'
        },
        yesPage: 'wobblerYes',
        noPage: 'wobblerNo'
    },
    wobblerYes: {
        title: '17(b) Felony Reduction',
        text: 'If you were convicted of a felony under a wobbler statute, you may be eligible for a 17(b) felony reduction. ' +
              'You can ask for a 17(b) reduction in your 1203.4 dismissal petition. Fill out form CR-180 to begin the filing process for your petition. ' +
              '[link to form CR-180.]'
    },
    wobblerNo: {
        title: '1203.4 Dismissal',
        text: 'You may still petition for a 1203.4 dismissal. Fill out form CR-180 to begin the filing process for your petition. [link to form CR-180.]'
    }
};

function displayHTML(pageId) {
    console.log('Displaying pageId = ' + pageId);
    if (history[history.length-1] !== pageId) { // for case of going backwards
        history.push(pageId);
    }
    var htmlText =
            ' <h2>' + pages[pageId]['title'] + '</h2>' +
            '<form class="form-horizontal" role="form">' +
            createPageText(pages[pageId]['text']) +
            createQAHTML(pages[pageId]['questions']) +
            createFormButtonsHTML(pageId) +
            '</form>';

    $('#wizard-text').html(htmlText);
}

function createPageText(text) {
    return text || '';
}

function createQAHTML(questions) {
    var htmlString = '';
    for (var qId in questions) {
        htmlString += createQuestionHTML(questions[qId]);
        htmlString += createAnswerInputHTML(qId);
    }
    return htmlString;
}

function createQuestionHTML(questionText) {
    return '<div class="form-group"><label class="col-sm-2 control-label">' + questionText + '</label>';
}

function createAnswerInputHTML(questionId) {
    var htmlString =
            '<div class="col-sm-10"><div class="radio-inline">' +
            '<label><input type="radio" name="' + questionId + '-radios" id="' + questionId + '-yes" value="true" checked> Yes </label>' +
            '</div>' +
            '<div class="radio-inline"><label><input type="radio" name="' + questionId + '-radios" id="' + questionId + '-no" value="false"> No </label>' +
            '</div></div></div>';
    return htmlString;
}

// Send in null to sectionID for no submit button in case of wizard end node
function createFormButtonsHTML(sectionId) {
    var htmlString =
            '<div class="form-group" style="margin-top:20px;">'
            + '<div class="col-sm-offset-2 col-sm-10">';
    htmlString += '<button id="back" type="submit" class="btn btn-default" style="margin-right: 10px;">Back</button>';
    htmlString += '<button id="start-over" type="submit" class="btn btn-default" style="margin-right: 10px;">Start Over</button>';
    if (sectionId) {
        htmlString += '<button id="wizard-submit" type="submit" class="btn btn-primary">Submit</button>';
    }
    htmlString +=
            '</div>'
            + '</div>';

    return htmlString;
}

function handleSubmit(e) {
    e.preventDefault();
    var result = '';
    var currentPage = history[history.length-1];
    var questions = pages[currentPage]['questions'];
    var yesPage = pages[currentPage]['yesPage'];
    var noPage = pages[currentPage]['noPage'];
    for (var qId in questions) {
        var answer = $('[name="' + qId + '-radios"]:checked').val();
        answers.push({qId: answer});
        if (truthy(answer)) {
            result = true;
        }
    }
    if(result) {
        displayHTML(yesPage);
    } else {
        displayHTML(noPage);
    }
}

Template.DismissIndex.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
    'click #wizard-submit': function(e, tmpl) {
        handleSubmit(e);
    },

    'click #linkTo5': function(e, tmpl) {
        e.preventDefault();
        displayHTML('p5');
    },

    'click #back': function(e, tmp) {
        e.preventDefault();
        history.pop();
        displayHTML(history[history.length - 1]);
    },

    'click #start-over': function(e, tmp) {
        location.reload();
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
    displayHTML('p1');
//    displayHTML('section1');
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