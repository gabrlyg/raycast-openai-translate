import { Form } from '@raycast/api';
import getPreference from '@utils/getPreference';

const Preferences = () => {
  return (
    <Form>
      <Form.TextField
        id='openai-api-key'
        title='OpenAI API Key'
        value={getPreference('openAiApiKey')}
        storeValue={true}
      />
      <Form.Separator />
      <Form.TextField id='model' title='Model' value={getPreference('model')} />
      <Form.TextField id='temperature' title='Temperature' value={getPreference('temperature')} />
      <Form.TextField id='top_p' title='top_p' value={getPreference('top_p')} />
      <Form.TextField id='presence_penalty' title='Presence Penalty' value={getPreference('presence_penalty')} />
      <Form.TextField id='frequency_penalty' title='Frequency Penalty' value={getPreference('frequency_penalty')} />
    </Form>
  );
};

export default Preferences;
