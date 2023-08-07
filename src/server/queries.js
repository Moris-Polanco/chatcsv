import HttpError from '@wasp/core/HttpError.js'

export const getFile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const file = await context.entities.File.findUnique({
    where: { id: args.fileId },
    include: { user: true }
  });

  if (!file) { throw new HttpError(404, `File with id ${args.fileId} not found.`) }

  if (file.userId !== context.user.id) { throw new HttpError(400, `File with id ${args.fileId} does not belong to user.`) }

  return file;
}

export const getQuestion = async ({ questionId }, context) => {
  if (!context.user) { throw new HttpError(401) }

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: { id: true },
  })

  if (!user) { throw new HttpError(401) }

  const question = await context.entities.Question.findUnique({
    where: { id: questionId },
    include: { file: true },
  })

  if (!question) { throw new HttpError(400) }

  if (question.file.userId !== user.id) { throw new HttpError(400) }

  return question
}

export const getAnswer = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const answer = await context.entities.Answer.findUnique({
    where: { id: args.answerId },
    include: { question: true }
  });

  if (!answer) { throw new HttpError(404, `Answer with id ${args.answerId} not found`) }

  const question = await context.entities.Question.findUnique({
    where: { id: answer.question.id },
    include: { file: true }
  });

  if (!question) { throw new HttpError(500, `Question with id ${answer.question.id} not found`) }

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    include: { files: { include: { questions: { include: { answer: true } } } } } }
  });

  if (!user) { throw new HttpError(500, `User with id ${context.user.id} not found`) }

  const userAnswer = user.files
    .flatMap(file => file.questions)
    .flatMap(question => question.answer)
    .find(userAnswer => userAnswer.id === answer.id);

  if (!userAnswer) { throw new HttpError(400, `Answer with id ${answer.id} does not belong to the authenticated user`) }

  return userAnswer;
}