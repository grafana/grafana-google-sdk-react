import type { DataSourceSettings } from "@grafana/data";
import {
  type DataSourceOptions,
  type DataSourceSecureJsonData,
  GoogleAuthType,
} from "./types";

/**
 * Ensures that the `options` object contains a default `authenticationType` in its `jsonData` property.
 *
 * If `options.jsonData.authenticationType` is not set, this function returns a new options object
 * with `authenticationType` set to `GoogleAuthType.JWT`. Otherwise, it returns the original options object.
 *
 */
export const getOptionsWithDefaults = (
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
) => {
  if (!options.jsonData.authenticationType) {
    return {
      ...options,
      jsonData: { ...options.jsonData, authenticationType: GoogleAuthType.JWT },
    };
  }

  return options;
};
