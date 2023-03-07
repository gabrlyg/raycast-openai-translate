import { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import buildUserPrompt, { SYS_PROMPT } from '@utils/prompts';

export interface TranslateQuery {
  openAiConfig: {
    openaiApiKey: string;
    model: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
  text: string;
  from: string;
  to: string;
}

export interface Response {
  content?: string;
  finishReason?: string;
}
const useOpenAITranslate = () => {
  const [data, setData] = useState<Response>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translate = async ({ openAiConfig, ...translateQuery }: TranslateQuery) => {
    setLoading(true);
    try {
      const configuration = new Configuration({
        apiKey: openAiConfig.openaiApiKey,
      });
      const openai = new OpenAIApi(configuration);
      const userPrompt = buildUserPrompt(translateQuery.text, translateQuery.from, translateQuery.to);
      const completion = await openai.createChatCompletion({
        model: openAiConfig.model,
        temperature: openAiConfig.temperature,
        messages: [SYS_PROMPT, userPrompt],
        // stream: true,
      });
      setLoading(false);
      setData({
        content: completion.data.choices[0].message?.content,
        finishReason: completion.data.choices[0].finish_reason,
      });
    } catch (error) {
      console.error('error requesting: ', error);
      setError(`Error requesting OpenAIApi: ${error}`);
    }
  };

  return { data, error, loading, translate };
};

export default useOpenAITranslate;
