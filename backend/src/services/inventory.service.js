import { cache } from "../config/cache.config.js"
import config from "../config/dotenv.config.js"
import { INVENTORY } from "../constants/sheet.constant.js"
import { getSheetData } from "./googleSheet.service.js"


const CACHE_KEY = "inventory"

export const getItemsLogic = async () => {

  const cachedItems = cache.get(CACHE_KEY)

  if (cachedItems) {
    console.log("from cache");
    return cachedItems;
  }

  console.log("from google sheet");

  const googleItems = await getSheetData(INVENTORY.Range.STOCK, INVENTORY.ID)



  const items = googleItems.map((item) => ({
    id: item[0],
    productName: item[1],
    category: item[2],
    stock: Number(item[3]),
    unit: `${item[4]}`,
    minStock: item[5] || ""
  }))


  cache.set(
    CACHE_KEY,
    items
  );

  return items
}