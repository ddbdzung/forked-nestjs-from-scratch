/**
 * Get duplicate items from a list of object based on key name
 * @param {Array<Object>} list Single, 1D, flatten array of object
 * @param {String} keyName Key name to check for duplicate (should be unique field)
 * @returns {Array<any>} List of duplicate items
 */
function getDuplicateItems(list, keyName) {
  if (!Array.isArray(list) || list.some((item) => typeof item !== 'object')) {
    throw new Error('List must be an array of object');
  }

  if (!keyName || typeof keyName !== 'string') {
    throw new Error('Key name must be a string');
  }

  const cleanList = list.filter((item) => item !== null && item !== undefined);

  if (cleanList.length === 0) {
    return [];
  }

  const listSet = new Set();
  const duplicates = [];

  cleanList.forEach((item) => {
    const key = item[keyName];

    if (key === null || key === undefined) {
      return;
    }

    if (listSet.has(key)) {
      duplicates.push(item);
    } else {
      listSet.add(key);
    }
  });

  return duplicates;
}

const list = [
  {
    _id: 1,
    productCode: 'PD01',
    productName: 'Product 1',
  },
  {
    _id: 2,
    productCode: 'PD02',
    productName: 'Product 2',
  },
  {
    _id: 3,
    productCode: 'PD01',
    productName: 'Product 1',
  },
  {
    _id: 4,
    productCode: 'PD03',
    productName: 'Product 3',
  },
  {
    _id: 5,
    productCode: 'PD02',
    productName: 'Product 2',
  },
  {
    _id: 6,
    productCode: 'PD04',
    productName: 'Product 4',
  },
  {
    _id: 7,
    productCode: 'PD05',
    productName: 'Product 5',
  },
  {
    _id: 8,
    productCode: 'PD06',
    productName: 'Product 6',
  },
  {
    _id: 9,
    productCode: 'PD07',
    productName: 'Product 7',
  },
  {
    _id: 10,
    productCode: 'PD08',
    productName: 'Product 8',
  },
  {
    _id: 11,
    productCode: 'PD09',
    productName: 'Product 9',
  },
  {
    _id: 12,
    productCode: 'PD10',
    productName: 'Product 10',
  },
  {
    _id: 13,
    productCode: 'PD11',
    productName: 'Product 11',
  },
  {
    _id: 14,
    productCode: 'PD12',
    productName: 'Product 12',
  },
  {
    _id: 15,
    productCode: 'PD13',
    productName: 'Product 13',
  },
  {
    _id: 16,
    productCode: 'PD14',
    productName: 'Product 14',
  },
  {
    _id: 17,
    productCode: 'PD15',
    productName: 'Product 15',
  },
  {
    _id: 18,
    productCode: 'PD16',
    productName: 'Product 16',
  },
  {
    _id: 19,
    productCode: 'PD17',
    productName: 'Product 17',
  },
];
const dup = getDuplicateItems(list, 'productCode');
console.log('[DEBUG][DzungDang] dup:', dup);
