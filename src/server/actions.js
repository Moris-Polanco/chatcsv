import HttpError from '@wasp/core/HttpError.js'

export const uploadFile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { description, content } = args;

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const newFile = await context.entities.File.create({
    data: {
      description,
      content,
      user: { connect: { id: user.id } }
    }
  });

  return newFile;
}

export const askQuestion = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { text, fileId } = args;

  const file = await context.entities.File.findUnique({
    where: { id: fileId }
  });

  if (!file) { throw new HttpError(404) };

  const question = await context.entities.Question.create({
    data: {
      text,
      file: { connect: { id: fileId } }
    }
  });

  return question;
}

export const answerQuestion = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { text, questionId } = args;

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const question = await context.entities.Question.findUnique({
    where: { id: questionId }
  });

  if (!user || !question) { throw new HttpError(400, 'Invalid user or question ID') }

  return context.entities.Answer.create({
    data: {
      text,
      question: { connect: { id: questionId } },
      user: { connect: { id: context.user.id } }
    }
  });
}