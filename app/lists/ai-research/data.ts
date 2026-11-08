export interface AIResearchResource {
  id: string
  name: string
  description: string
  url: string
}

export const resources: AIResearchResource[] = [
  {
    id: 'history-of-llms',
    name: 'A History of Large Language Models',
    description: 'Traces the academic foundations of modern LLMs through key innovations: distributed word representations, sequence-to-sequence models, attention, transformers, and generative pre-training.',
    url: 'https://gregorygundersen.com/blog/2025/10/01/large-language-models/',
  },
  {
    id: 'how-to-be-more-ambitious',
    name: 'How to Be More Ambitious: A Tutorial for Humans with Models',
    description: 'Felix Rieseberg on why people aim too low with AI models, and a practical way to think bigger about outcomes, depth, and the expertise you can draw on.',
    url: 'https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/',
  },
  {
    id: 'deep-learning-not-so-mysterious',
    name: 'Deep Learning Is Not So Mysterious or Different',
    description: 'Andrew Gordon Wilson argues that benign overfitting, double descent, and the benefits of overparameterization are not unique to neural networks, and explains them with soft inductive biases and long-standing frameworks like PAC-Bayes.',
    url: 'https://arxiv.org/abs/2503.02113',
  },
]
