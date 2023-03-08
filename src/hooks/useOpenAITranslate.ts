import { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import buildUserPrompt, { SYS_PROMPT } from '@utils/prompts';

export interface TranslateQuery {
  openAiConfig: {
    openaiApiKey: string;
    model: string;
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
  const [isLoading, setIsLoading] = useState(false);

  const translate = async ({ openAiConfig, ...translateQuery }: TranslateQuery) => {
    setIsLoading(true);
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
      setIsLoading(false);
      setData({
        content: completion.data.choices[0].message?.content,
        finishReason: completion.data.choices[0].finish_reason,
      });
    } catch (error) {
      console.error('error requesting: ', error);
      setError(`${error}`);
    }
  };

  return { data, error, isLoading, translate };
};

export default useOpenAITranslate;
