const deleteProduct = async (btn) => {
  const parent = btn.parentNode;
  const prodId = parent.querySelector('[name="productId"]').value;
  const csrf = parent.querySelector('[name="_csrf"]').value;
  const productElement = parent.closest("article");
  const res = await fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  });
  if (res.status === 200) {
    productElement.parentNode.removeChild(productElement);
  } else {
    alert("Error occured!");
  }
  console.log(res);
};
