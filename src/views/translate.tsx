import {
  Action,
  ActionPanel,
  Form,
  getPreferenceValues,
  Icon,
  openCommandPreferences,
  useNavigation,
} from '@raycast/api';
import { LANGUAGES } from '@utils/languages';
import useOpenAITranslate from '@hooks/useOpenAITranslate';
import Configuration from '@views/configuration';
import { getAllParamsFromLocalStorage } from '@utils/parameters';

export default function Translate() {
  const { push } = useNavigation();
  const { data, error, loading, translate } = useOpenAITranslate();

  return (
    <Form
      actions={
        <ActionPanel title='OpenAI Translate'>
          <ActionPanel.Section>
            <Action.SubmitForm
              title='Translate'
              icon={Icon.Globe}
              onSubmit={async (values) => {
                const { text, from, to } = values;
                const { model, temperature, top_p, presence_penalty, frequency_penalty } =
                  await getAllParamsFromLocalStorage();
                translate({
                  openAiConfig: {
                    openaiApiKey: getPreferenceValues().openAiApiKey,
                    model,
                    temperature,
                    top_p,
                    presence_penalty,
                    frequency_penalty,
                  },
                  text,
                  from,
                  to,
                });
              }}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action
              title='Change API Key'
              icon={Icon.Key}
              onAction={() => openCommandPreferences()}
              shortcut={{ modifiers: ['cmd'], key: 'k' }}
            />
          </ActionPanel.Section>
          <Action
            title='Configure Parameters'
            icon={Icon.Gear}
            onAction={() => push(<Configuration />)}
            shortcut={{ modifiers: ['cmd', 'shift'], key: ',' }}
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
