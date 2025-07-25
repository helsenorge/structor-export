import { TFunction } from "react-i18next";
import { findExtensionByUrl } from "src/helpers/extensionHelper";
import { TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { IExtensionType } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import {
  createError,
  GetValueAfterSlash,
  HelsenorgeBinaryStartText,
  HelsenorgeEndpointStartText,
} from "../validationHelper";
import { ErrorLevel, ValidationType } from "../validationTypes";

export const validateQuestionnaireSettings = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  return validate(t, state.qMetadata);
};

const validate = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  errors.push(...validateEndpoint(t, qMetadata));
  errors.push(...validateBinary(t, qMetadata));

  return errors;
};

const validateEndpoint = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  const endpoint = findExtensionByUrl(
    qMetadata.extension,
    IExtensionType.endpoint,
  );
  if (endpoint) {
    if (!endpoint.valueReference || !endpoint.valueReference.reference) {
      returnErrors.push(
        createError(
          "",
          ValidationType.endpoint,
          t("Cannot find the Endpoint's reference"),
          ErrorLevel.error,
        ),
      );
    } else {
      if (
        !endpoint.valueReference.reference.startsWith(
          HelsenorgeEndpointStartText,
        )
      ) {
        returnErrors.push(
          createError(
            "",
            ValidationType.endpoint,
            t(
              "In case of Helsenorge, endpoint must start with 'Endpoint/<Endpoint's Id>'",
            ),
            ErrorLevel.warning,
          ),
        );
      } else {
        if (!GetValueAfterSlash(endpoint.valueReference.reference)) {
          returnErrors.push(
            createError(
              "",
              ValidationType.endpoint,
              t(
                "Endpoint does not have an valid id 'Endpoint/<Endpoint's Id>'",
              ),
              ErrorLevel.error,
            ),
          );
        }
      }
    }
  }
  return returnErrors;
};

const validateBinary = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  const binary = findExtensionByUrl(
    qMetadata.extension,
    IExtensionType.printVersion,
  );
  if (binary) {
    if (!binary.valueReference || !binary.valueReference.reference) {
      returnErrors.push(
        createError(
          "",
          ValidationType.binary,
          t("Cannot find the print version's reference"),
          ErrorLevel.error,
        ),
      );
    } else {
      if (
        !binary.valueReference.reference.startsWith(HelsenorgeBinaryStartText)
      ) {
        returnErrors.push(
          createError(
            "",
            ValidationType.binary,
            t(
              "In case of Helsenorge, reference to print version must start with 'Binary/<print version's Id>'",
            ),
            ErrorLevel.warning,
          ),
        );
      } else {
        if (!GetValueAfterSlash(binary.valueReference.reference)) {
          returnErrors.push(
            createError(
              "",
              ValidationType.binary,
              t(
                "Print version does not have an valid id 'Binary/<print version's Id>'",
              ),
              ErrorLevel.error,
            ),
          );
        }
      }
    }
  }
  return returnErrors;
};
