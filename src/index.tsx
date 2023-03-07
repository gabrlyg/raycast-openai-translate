import { Action, ActionPanel, Form, getPreferenceValues, Icon, openCommandPreferences } from '@raycast/api';
import { LANGUAGES } from '@utils/languages';
import useOpenAITranslate from '@hooks/useOpenAITranslate';
import { OpenAiTranslatePreferenceValues } from './types/preferences';
import getPreference from '@utils/getPreference';

export default function RaycastGPTTranslate() {
  const { data, error, loading, translate } = useOpenAITranslate();

  return (
    <Form
      actions={
        <ActionPanel title='OpenAI Translate'>
          <ActionPanel.Section>
            <Action.SubmitForm
              title='Translate'
              onSubmit={(values) => {
                const { text, from, to } = values;
                translate({
                  openAiConfig: {
                    openaiApiKey: getPreferenceValues<OpenAiTranslatePreferenceValues>().openAiApiKey,
                    model: getPreference('model'),
                    temperature: parseFloat(getPreference('temperature')),
                    top_p: parseFloat(getPreference('top_p')),
                    frequency_penalty: parseFloat(getPreference('frequency_penalty')),
                    presence_penalty: parseFloat(getPreference('presence_penalty')),
                  },
                  text,
                  from,
                  to,
                });
              }}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action title='Change API Key' icon={Icon.Key} onAction={() => openCommandPreferences()} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      <Form.TextArea id='text' title='Text' autoFocus={true} />
      {/* TODO: add token count here */}
      <Form.Dropdown id='from' title='From'>
        {renderLanguageList()}
      </Form.Dropdown>
      <Form.Dropdown id='to' title='To'>
        {renderLanguageList(true)}
      </Form.Dropdown>
      <Form.TextArea
        id='translation'
        value={loading ? 'Translating...' : data.content || ''}
        error={error}
        title='Translation'
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
    </Form>
  );
}

const renderLanguageList = (filterOutAuto = false) =>
  Object.entries(LANGUAGES)
    .filter(([lang]) => (filterOutAuto ? lang !== 'auto' : true)) // obviously this introduced another pass, which is slow
    .map(([lang, display]) => <Form.Dropdown.Item key={lang} value={lang} title={display} />);
