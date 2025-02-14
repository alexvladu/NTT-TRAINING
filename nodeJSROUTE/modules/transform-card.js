module.exports=(product, productCardHTML) =>
{
    let output=productCardHTML.replace(/{%IMAGE%}/g, product.image);
    output=output.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output=output.replace(/{%QUANTITY%}/g, product.quantity);
    output=output.replace(/{%PRICE%}/g, product.price);
    output=output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output=output.replace(/{%FROM%}/g, product.from);
    output=output.replace(/{%ID%}/g, product.id);
    output=output.replace(/{%DESCRIPTION%}/, product.description);
    return output;
}