import { oraclesApi } from './api/oraclesApi';

export async function getAstralChart(payload) {
  return oraclesApi.getNatalChart(payload);
}
