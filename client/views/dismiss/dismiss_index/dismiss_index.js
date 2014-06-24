/*****************************************************************************/
/* DismissIndex: Event Handlers and Helpers */
/*****************************************************************************/
Template.DismissIndex.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
    'click #page-1-submit': function(e, tmpl) {
        e.preventDefault();
        var a1 = $('[name="q1-radios"]:checked').val();
        var a2 = $('[name="q2-radios"]:checked').val();
        var a3 = $('[name="q3-radios"]:checked').val();
        var a4 = $('[name="q4-radios"]:checked').val();
        if(truthy(a1) || truthy(a2) || truthy(a3) || truthy(a4)) {
            console.log("You are ineligible for a dismissal. However, you MAY BE ELIGIBLE for a Certificate of Rehabilitation. [See chart to check for eligibility for a Certificate of Rehabilitation]");
        } else {
            console.log("On to q2");
        }
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