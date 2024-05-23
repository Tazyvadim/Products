export function calcPaginationMeta(req: any, total: number) {
  return {
    count: total,
    pageNum: req.pageNum ? req.pageNum : 0,
    pageSize: req.pageSize ? req.pageSize : 0,
  };
}
