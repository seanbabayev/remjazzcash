import { logger } from '../logger';

// Mock process.env
const env = { NODE_ENV: 'development' };

// Use Object.defineProperty to make NODE_ENV configurable
Object.defineProperty(process, 'env', {
  get() {
    return env;
  }
});

describe('Logger Utility', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    env.NODE_ENV = 'development';
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs info messages correctly', () => {
    const message = 'Test info message';
    const data = { user: 'test' };

    logger.info(message, data);

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
      { data }
    );
  });

  it('logs warning messages correctly', () => {
    const message = 'Test warning message';
    const data = { warning: 'test' };

    logger.warn(message, data);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
      { data }
    );
  });

  it('logs error messages correctly', () => {
    const error = new Error('Test error');
    const context = { action: 'test' };

    logger.error(error, context);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(error.message),
      expect.objectContaining({
        data: {
          stack: error.stack,
          context
        }
      })
    );
  });

  it('includes timestamp in log messages', () => {
    const message = 'Test message';
    logger.info(message);

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/),
      expect.any(Object)
    );
  });

  it('handles objects in log messages', () => {
    const message = { key: 'value' };
    logger.info(message);

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(JSON.stringify(message)),
      expect.any(Object)
    );
  });

  it('handles undefined context data', () => {
    const message = 'Test message';
    logger.info(message, undefined);

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(message),
      expect.any(Object)
    );
  });

  it('does not log in production', () => {
    env.NODE_ENV = 'production';
    
    const message = 'Test message';
    logger.info(message);
    logger.warn(message);
    logger.error(message);

    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    env.NODE_ENV = 'development';
  });
});
