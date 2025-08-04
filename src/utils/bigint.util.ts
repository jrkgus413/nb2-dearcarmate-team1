export const safeJsonStringify = (obj: any) => {
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'bigint') {
      const num = Number(value);
      if (Number.isSafeInteger(num)) {
        return num; // 안전한 정수: 숫자로 변환
      } else {
        return value.toString(); // 너무 크거나 작으면 문자열로
      }
    }
    return value;
  });
}