import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getDataQuery(table, query) {
  await fakeNetwork(`get${table}:${query}`);
  let data = await localforage.getItem(table);

  if (!data) {
    return [];
  }

  if (query) {
    data = matchSorter(data, query, { keys: ["first", "last"] });
  }
  return data.sort(sortBy("last", "createdAt"));
}

export async function createData(table, isOnline) {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let newData = { id, createdAt: Date.now() };
  if (isOnline) {
    let data = await getDataQuery(table);
    data.unshift(newData);
    await set(table, data);
  } else {
    await addUpdateToQueue(table, id, newData);
  }
  return newData;
}

export async function getDataId(table, id) {
  await fakeNetwork(`${table}:${id}`);
  let datas = await localforage.getItem(table);
  let data = datas.find((data) => data.id === id);
  return data ?? null;
}

export async function updateData(table, id, updates, isOnline) {
  if (isOnline) {
    await fakeNetwork();
    const datas = await localforage.getItem(table);
    const data = datas.find((data) => data.id === id);
    if (!data) throw new Error("No contact found for", id);
    Object.assign(data, updates);
    await set(table, datas);
    return data;
  } else {
    await addUpdateToQueue(table, id, updates);
    return updates;
  }
}

export async function deleteData(table, id, isOnline) {
  if (isOnline) {
    let datas = await localforage.getItem(table);
    let index = datas.findIndex((data) => data.id === id);
    if (index > -1) {
      datas.splice(index, 1);
      await set(table, datas);
      return true;
    }
    return false;
  }
  let datas = await localforage.getItem(table);
  let index = datas.findIndex((data) => data.id === id);
  if (index > -1) {
    datas.splice(index, 1);
    await set(table, datas);
    return true;
  }
  return false;
}

export function set(table, datas) {
  console.log(datas);
  return localforage.setItem(table, datas);
}

export async function addUpdateToQueue(table, id, updates) {
  const updateQueue = await localforage.getItem(`${table}-updateQueue`);
  const updateData = updateQueue || {};
  updateData[id] = updates;
  await localforage.setItem(`${table}-updateQueue`, updateData);
}

export async function processUpdateQueue(table) {
  const updateQueue = await localforage.getItem(`${table}-updateQueue`);
  if (!updateQueue) return;

  const datas = await localforage.getItem(table);
  const updatedDatas = datas.map((data) => {
    const update = updateQueue[data.id];
    if (update) {
      Object.assign(data, update);
      delete updateQueue[data.id];
    }
    return data;
  });

  await localforage.setItem(table, updatedDatas);
  await localforage.setItem(`${table}-updateQueue`, updateQueue);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
