import { getPreferenceValues } from '@raycast/api';
import { OpenAiTranslatePreferenceValues } from '../types/preferences';

type PreferenceKeys = 'openAiApiKey' | 'model' | 'temperature' | 'top_p' | 'presence_penalty' | 'frequency_penalty';

const getPreference = (key: PreferenceKeys) => {
  return getPreferenceValues<OpenAiTranslatePreferenceValues>()[key].toString();
};

export default getPreference;
