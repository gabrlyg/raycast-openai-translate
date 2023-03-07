import { Action, ActionPanel, Form, getPreferenceValues } from '@raycast/api';
import useOpenAITranslate from './hooks/useOpenAITranslate';
import { LANGUAGES } from './utils/languages';

export default function RaycastGPTTranslate() {
  const { data, error, loading, translate } = useOpenAITranslate();

  return (
    <Form
      actions={
        <ActionPanel title='GPT Translate'>
          <Action.SubmitForm
            title='Translate'
            onSubmit={(values) => {
              const { text, from, to } = values;
              // console.log(values);
              translate({
                openAiConfig: {
                  openaiApiKey: getPreferenceValues().openAiApiKey,
                  model: 'gpt-3.5-turbo',
                  temperature: 0,
                  top_p: 1,
                  frequency_penalty: 1,
                  presence_penalty: 1,
                },
                text,
                from,
                to,
              });
            }}
          />
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
