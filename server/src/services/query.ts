import { Request } from "express";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; // * get all (no limit)

function getPagination(req: Request) {
  const { limit, page } = req.query;
  const l = Math.abs(Number(limit)) || DEFAULT_PAGE_LIMIT;
  const p = Math.abs(Number(page)) || DEFAULT_PAGE_NUMBER;
  const skip = (p - 1) * l;
  return { limit: l, skip };
}

export { getPagination };
