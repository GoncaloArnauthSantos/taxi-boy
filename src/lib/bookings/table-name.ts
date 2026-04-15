export const DEFAULT_BOOKINGS_TABLE_NAME = "bookings_local";
export const DEFAULT_E2E_BOOKINGS_TABLE_NAME = "bookings_test";

export const isTestTableName = (tableName: string): boolean => {
  const normalized = tableName.toLowerCase();
  return normalized.includes("test") || normalized.includes("_e2e");
};

export const assertTestTableName = (
  tableName: string,
  context: string
): void => {
  if (!isTestTableName(tableName)) {
    throw new Error(
      `${context}: table "${tableName}" must point to a test table.`
    );
  }
};
