/*****************************************************************************/
/* DismissIndex: Event Handlers and Helpers */
/*****************************************************************************/

var answers = {};
var history = [];
var pages = {
    p1: {
        title: 'I. Baseline Eligibility',
        questions: {
            q0: 'Did you receive a prison sentence for your conviction?',
            q1: 'Were you convicted of a serious sex offense (Cal. Penal Code sections 586, 288, 288a, 288.5, 289, or 261.5) OR failing to obey a police officer (Vehicle Code section 42001)?',
            q2: 'Are you currently facing charges?',
            q3: 'Are you currently on probation or parole?'

        },
        firstPage: true,
        yesPage: 'rehabCert',
        noPage: 'p2'
    },
    rehabCert: {
        title: 'Ineligible',
        text:  'You are ineligible for a dismissal. However, you MAY BE ELIGIBLE for a Certificate of Rehabilitation.' +
               '[See chart to check for eligibility for a Certificate of Rehabilitation]',
        endPage: true
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
        text: 'YOU ARE ELIGIBLE for a mandatory 1203.4a dismissal. <a href="http://www.courts.ca.gov/documents/cr180.pdf" target="_blank">Fill out form CR-180 to begin the filing process for your petition.</a>',
        endPage: true
    },
    mayQualify12034: {
        title: 'Discretionary Dismissal',
        text: 'YOU MAY QUALIFY for a discretionary 1203.4 dismissal. <a href="http://www.courts.ca.gov/documents/cr180.pdf" target="_blank">Fill out form CR-180 to begin the filing process for your petition.</a>' +
              'or consider waiting out the one year period for a mandatory dismissal.',
        endPage: true
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
        text: 'YOU MAY QUALIFY for a discretionary 1203.4 dismissal. <a href="http://www.courts.ca.gov/documents/cr180.pdf" target="_blank">Fill out form CR-180 to begin the filing process for your petition.</a>' +
            'If you were convicted of a felony, go on to <a href="#" id="linkTo5">question V</a> to see if you are eligible for a 17(b) felony reduction.',
        endPage: true
    },
    seemsWrong: {
        title: '1203.4 Dismissal',
        text: 'YOU MAY QUALIFY for a discretionary 1203.4 dismissal. <a href="http://www.courts.ca.gov/documents/cr180.pdf" target="_blank">Fill out form CR-180 to begin the filing process for your petition.</a>' +
                'If you were convicted of a felony, go on to <a href="#" id="linkTo5">question V</a> to see if you are eligible for a 17(b) felony reduction.',
        endPage: true
    },
    wobblerYes: {
        title: '17(b) Felony Reduction',
        text: 'If you were convicted of a felony under a wobbler statute, you may be eligible for a 17(b) felony reduction. ' +
              'You can ask for a 17(b) reduction in your 1203.4 dismissal petition. <a href="http://www.courts.ca.gov/documents/cr180.pdf" target="_blank">Fill out form CR-180 to begin the filing process for your petition.</a>',
        endPage: true
    },
    wobblerNo: {
        title: '1203.4 Dismissal',
        text: 'You may still petition for a 1203.4 dismissal. <a href="http://www.courts.ca.gov/documents/cr180.pdf" target="_blank">Fill out form CR-180 to begin the filing process for your petition.</a>',
        endPage: true
    },
    p5: {
        title: 'V. Felony Wobbler',
        questions: {
            q9: 'Were you convicted of a felony wobbler? [A wobbler conviction is a conviction that is punishable as a felony OR a misdemeanor.]'
        },
        yesPage: 'wobblerYes',
        noPage: 'wobblerNo'
    }
};

function displayHTML(pageId) {
    removeMessages();
    console.log('Displaying pageId = ' + pageId);
    if (history[history.length-1] !== pageId) { // for case of going backwards
        history.push(pageId);
    }
    var htmlText =
            '<div id="dismissal-wiz" style="width: 600px">' +
            '<h2 id="dismissal-wiz-title" style="margin-bottom: 20px;">' + pages[pageId]['title'] + '</h2>' +
            createPageText(pages[pageId]['text']) +
            createQAHTML(pages[pageId]['questions']) +
            createFormButtonsHTML(pageId) +
            '</div>';

    document.getElementById('dismissal-wiz-viewport').innerHTML = htmlText;
}

function createPageText(text) {
    return text || '';
}

function createQAHTML(questions) {
    var htmlString = '<div id="dismissal-wiz-qa-section"">';
    for (var qId in questions) {
        htmlString += '<div style="margin-bottom: 15px;">';
        htmlString += createQuestionHTML(questions[qId]);
        htmlString += createAnswerInputHTML(qId);
        htmlString += '</div>';
    }
    htmlString += '</div>';
    return htmlString;
}

function createQuestionHTML(questionText) {
    return '<div style="display: table-cell; width: 450px; padding-right: 20px;">' + questionText + '</div>';
}

function createAnswerInputHTML(questionId) {
    var htmlString =
            '<div style="display: table-cell; width: 110px;">' +
            '<div style="display: inline; margin-right: 10px;">';
    if (answers[questionId] === 'yes') {
        htmlString += '<input type="radio" name="' + questionId + '-radios" id="' + questionId + '-yes" value="yes" checked /> Yes';
    } else {
        htmlString += '<input type="radio" name="' + questionId + '-radios" id="' + questionId + '-yes" value="yes" /> Yes';
    }
    htmlString += '</div><div style="display: inline">';
    if (answers[questionId] === 'no') {
        htmlString += '<input type="radio" name="' + questionId + '-radios" id="' + questionId + '-no" value="no" checked /> No';
    } else {
        htmlString += '<input type="radio" name="' + questionId + '-radios" id="' + questionId + '-no" value="no" /> No';
    }
    htmlString += '</div></div>';
    return htmlString;
}

function createFormButtonsHTML(pageId) {
    var htmlString = '<div id="dismissal-wiz-buttons" style="margin-top: 30px; text-align: center">';
    if (!truthy(pages[pageId]['firstPage'])) {
        htmlString += '<button id="back" type="submit" class="btn btn-default" style="margin-right: 10px;">Back</button>';
    }
    htmlString += '<button id="start-over" type="submit" class="btn btn-default" style="margin-right: 10px;">Start Over</button>';
    if (!pages[pageId]['endPage']) {
        htmlString += '<button id="wizard-submit" type="submit" class="btn btn-primary">Submit</button>';
    }
    htmlString += '</div>';
    return htmlString;
}

function handleWizardSubmit(e) {
    e.preventDefault();
    removeMessages();
    var errors = [];
    var result = '';
    var currentPage = history[history.length-1];
    var questions = pages[currentPage]['questions'];
    var nextPageId;
    questionLoop: for (var qId in questions) {  // break this out into handleRadioAnswer
        var radios = document.getElementsByName(qId + '-radios');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                answers[qId] = radios[i].value;
                break;                 // only one radio can be logically checked, don't check the rest
            } else {
                if (i === radios.length - 1) {
                    errors.push("Question not answered.");
                }
            }
        }
    }
    if (existy(errors)) {
        displayError(errors);
        return;
    }
    nextPageId = pages[currentPage]['noPage'];
    for (var qId in questions) {
        if (answers[qId] === 'yes') {
            nextPageId = pages[currentPage]['yesPage'];
            break;
        } else if (answers[qId] !== 'no') {
            console.log('Question ' + qId + ' had no recorded error.');
        }
    }
    displayHTML(nextPageId);
}

function removeMessages() {
    var flashMessages = document.getElementById('flash-messages');
    if (flashMessages) {
        flashMessages.parentNode.removeChild(flashMessages);
    }
}

function displayError(errors) {
    var wizardElem = document.getElementById('dismissal-wiz');
    var messagesHTML = '<div id="flash-messages" style="color: red">';
            for (var i=0; i < errors.length; i++) {
            messagesHTML +=
                '<h3>' +
                errors[0] +
                '</h3>';
            }
    messagesHTML += '</div>';
    wizardElem.insertAdjacentHTML('afterbegin', messagesHTML);
}

function handleRadioAnswer(qId) {
    errors = [];
    nextPageId;
    var radios = document.getElementsByName(qId + '-radios');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            answers.push({qId: radios[i].value});
            if (truthy(radios[i].value)) {
                result = true;
                nextPageId = pages[currentPage]['yesPage'];
                return {break: true}
            } else {
                nextPageId = pages[currentPage]['noPage'];
            }
            // only one radio can be logically checked, don't check the rest
            break;
        } else {
            if (i === radios.length - 1) {
                errors.push("Question not answered.");
            }
        }
    }
    return {break: false, errors: errors, nextPageId: nextPageId};
}

Template.DismissIndex.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
    'click #wizard-submit': function(e, tmpl) {
        handleWizardSubmit(e);
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
    if (!existy(a) || a === 'false' || a === "0") {
        return false;
    } else {
        return true;
    }
}

function existy(a) {
    if (typeof(a) === 'object') {
        if (a.length === 0) {
            return false;
        }
    }
    return (a != null && a != '');
}

function empty(a) {
    if (a === null || a === '') {
        return true;
    }
}