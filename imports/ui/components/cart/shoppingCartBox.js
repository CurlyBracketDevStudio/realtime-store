import { Session } from 'meteor/session';
import Carts from '/imports/api/carts/carts.js';

Template.shoppingCartBox.helpers({
  cartItems() {
    // Anonymous
    if(!Meteor.userId()){
      userCart = JSON.parse(window.localStorage.getItem("userCart"));
      Session.get("userCart", userCart);
      return showItems(userCart)
    }

    // Connected
    var userCart = Carts.findOne();
    showItems(userCart);

    function showItems() {
      if (userCart && userCart.items) {
        const items = userCart.items;
        var count = 1;
        return _.map(items, function(item) {
          if(count < 4){
            return item;
            count++;
          }
        });
      }
    }
  },
  itemsCount(){
    var userCart = Carts.findOne();
    if(!Meteor.userId()){
      Session.get("userCart", userCart);
      userCart = JSON.parse(window.localStorage.getItem("userCart"));
    }
    if (userCart){
      Session.set("cartIsNotEmpty", !!userCart.items.length);
      return userCart.items.length;
    }
  },
  totalCartAmount() {
    // TODO: Calculate the total amount
    return 0;
  },
  cartIsNotEmpty() {
    return Session.get("cartIsNotEmpty");
  },
  _userCart() {
    return Carts.findOne();
  }
});

Template.shoppingCartBox.events({
  'click .remove': (event)=> {
    const itemRef = event.target.id.substr(1);
    Meteor.call('removeFromCart', itemRef, function(err, res){
      console.log('err', err);
      console.log('res', res);
    })
  }
})
