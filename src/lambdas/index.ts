import {
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  SkillBuilders,
} from "ask-sdk-core";
import { Response, SessionEndedRequest } from "ask-sdk-model";

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText =
      "開発キットの天気ボットにようこそ。天気のことは私に聞いてください。";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(
        "開発キットの天気ボットにようこそ。天気のことは私に聞いてください。",
        speechText
      )
      .getResponse();
  },
};

const AskWeatherIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "TellWeatherIntent"
    );
  },
  async handle(handlerInput: HandlerInput): Promise<Response> {
    const speechText = "今日の天気は晴れです。";

    console.log("Log: Testing TellTimeIntent");
    await doSomething();

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("天気についていつでも聞いて下さいね。")
      .withSimpleCard("今日の天気は晴れです。", speechText)
      .getResponse();
  },
};

const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = "天気のことは私に聞いてください。";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("天気のことは私に聞いてください。", speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = "さようなら。";

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard("さようなら。", speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput: HandlerInput): Response {
    console.log(
      `セッションが終了しました。理由：${
        (handlerInput.requestEnvelope.request as SessionEndedRequest).reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler: ErrorHandler = {
  canHandle(handlerInput: HandlerInput, error: Error): boolean {
    return true;
  },
  handle(handlerInput: HandlerInput, error: Error): Response {
    console.log(`処理されたエラー：${error.message}`);

    return handlerInput.responseBuilder
      .speak(
        "すみません。コマンドを理解できませんでした。もう一度言ってください。"
      )
      .reprompt(
        "すみません。コマンドを理解できませんでした。もう一度言ってください。"
      )
      .getResponse();
  },
};

exports.handler = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AskWeatherIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

const doSomething = async () => {
  console.log("do something!");
};
