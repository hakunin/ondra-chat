
// redux needs a reducer for each field in the state
// in case of our computed values (like currentUser)
// we don't want to use a singletonReducer since that
// would allow changing that value.
// Instead the value is changes, when a user record
// is changed in store's users field.
export default (state, action) => {
  // default value must be null
  return state || null;
};
