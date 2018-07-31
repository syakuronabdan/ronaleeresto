module.exports = {
  foodMsg: {
    create_success: name => `<strong>${name}</strong> has been added to menu`,
    create_duplicate: '<strong>Email</strong> is already used',
    not_found: 'Menu not found',
    edit_success: 'Edit menu success',
    delete_success: 'Delete menu success',
  },
  categoryMsg: {
    create_success: name => `<strong>${name}</strong> has been added to category`,
    create_duplicate: name => `<strong>${name}</strong> is already created`,
    not_found: '^Category not chosen',
    edit_success: 'Edit category success',
    delete_success: 'Delete category success',
  },
  validateMsg: {
    category: 'not a valid input',
  },
};
