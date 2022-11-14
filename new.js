let query = require("./db/mysql_db");

async function test(params) {
  const result = (
    await query(`SELECT 
JSON_ARRAY(t_priceList.byName) as priceList,
JSON_ARRAYAGG(t_mainImages.image_link) as images,
t_productId.productId, 
t_basicInfo.display, t_basicInfo.scrapMethod, t_basicInfo.product_link,	t_basicInfo.description_link, t_basicInfo.minPrice, t_basicInfo.maxPrice, t_basicInfo.discountNumber, t_basicInfo.discount, t_basicInfo.minPrice_AfterDiscount, t_basicInfo.maxPrice_AfterDiscount, t_basicInfo.multiUnitName, t_basicInfo.oddUnitName, t_basicInfo.maxPurchaseLimit, t_basicInfo.buyLimitText, t_basicInfo.quantityAvaliable, t_basicInfo.totalOrders, t_basicInfo.totalProductSoldCount, t_basicInfo.totalProductSoldCountUnit, t_basicInfo.totalProductWishedCount, t_basicInfo.comingSoon,    
t_modifiedDescription.description
FROM t_productId
JOIN t_basicInfo ON t_basicInfo.foreign_id = t_productId.id
JOIN t_mainImages ON t_mainImages.foreign_id = t_productId.id
JOIN t_modifiedDescription ON t_modifiedDescription.foreign_id = t_productId.id
JOIN t_priceList ON t_priceList.foreign_id = t_productId.id
WHERE t_productId.productId = 3256802448401349
GROUP BY 
t_basicInfo.id,
t_modifiedDescription.id,
t_priceList.byName 
LIMIT 1;`)
  ).rows[0];

  const size = new TextEncoder().encode(JSON.stringify(result)).length;
  const kiloBytes = parseFloat((size / 1024).toFixed(2));
  const megaBytes = parseFloat((kiloBytes / 1024).toFixed(5));
  console.log(result);
  console.log([kiloBytes + " kb", megaBytes + " mb"]);
}

test();
