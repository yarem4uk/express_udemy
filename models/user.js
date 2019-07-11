import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    requried: true,
  },

  resetToken: String,

  resetTokenExpiration: Date,

  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    }],
  },
});

userSchema.methods.addToCart = function (product) {
  const updatedCartItems = [...this.cart.items];
  const cartProductIndex = this.cart.items
    .findIndex(cp => cp.productId.toString() === product._id.toString());

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += 1;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCart = this.cart.items
    .filter(prod => prod.productId.toString() !== productId.toString());
  this.cart.items = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { item: [] };
  return this.save();
};

export default mongoose.model('User', userSchema);
