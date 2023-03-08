import { Action, ActionPanel, Form, Icon } from '@raycast/api';

import { getAllParamsFromLocalStorage, PARAMETERS, Parameters, saveParamsToLocalStorage } from '@utils/parameters';
import { useEffect, useState } from 'react';

const Configuration = () => {
  const [config, setConfig] = useState<Parameters>({} as Parameters);
  const [isLoading, setIsLoading] = useState(true);
  const { model, temperature, top_p, presence_penalty, frequency_penalty } = config;

  useEffect(() => {
    let isMounted = true;
    const setConfigFromParams = async () => {
      if (isMounted) {
        const params = await getAllParamsFromLocalStorage();
        setIsLoading(false);
        setConfig(params);
      }
    };
    setConfigFromParams();
    return () => {
      console.log('configuration unmounting');
      isMounted = false;
    };
  }, []);

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values) => {
              saveParamsToLocalStorage(values as Parameters);
            }}
            title='Save Configuration'
            icon={Icon.CheckCircle}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id='model' title='Model' value={model} storeValue={true} info={PARAMETERS.model.description}>
        {PARAMETERS.model.data.map((m) => (
          <Form.Dropdown.Item value={m} title={m} key={m} />
        ))}
      </Form.Dropdown>
      <Form.TextField
        id='temperature'
        title='Temperature'
        value={`${temperature}`}
        info={`${PARAMETERS.temperature.description}\n\nDefault: ${PARAMETERS.temperature.default}`}
      />
      <Form.TextField
        id='top_p'
        title='top_p'
        value={`${top_p}`}
        info={`${PARAMETERS.top_p.description}\n\nDefault: ${PARAMETERS.top_p.default}`}
      />
      <Form.TextField
        id='presence_penalty'
        title='Presence Penalty'
        value={`${presence_penalty}`}
        info={`${PARAMETERS.presence_penalty.description}\n\nDefault: ${PARAMETERS.presence_penalty.default}`}
      />
      <Form.TextField
        id='frequency_penalty'
        title='Frequency Penalty'
        value={`${frequency_penalty}`}
        info={`${PARAMETERS.frequency_penalty.description}\n\nDefault: ${PARAMETERS.frequency_penalty.default}`}
      />
    </Form>
  );
};

export default Configuration;
