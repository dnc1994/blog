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
    id: 'deep-learning-not-so-mysterious',
    name: 'Deep Learning Is Not So Mysterious or Different',
    description: 'Andrew Gordon Wilson argues that benign overfitting, double descent, and the benefits of overparameterization are not unique to neural networks, and explains them with soft inductive biases and long-standing frameworks like PAC-Bayes.',
    url: 'https://arxiv.org/abs/2503.02113',
  },
]
