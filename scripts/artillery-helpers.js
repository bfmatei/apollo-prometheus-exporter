module.exports = {
  setProbabilities(context, _events, done) {
    context.vars['runInvalidFieldNamed'] = Math.random() > 0.999;
    context.vars['runNotFoundNamed'] = Math.random() > 0.999;
    context.vars['runInvalidFieldUnnamed'] = Math.random() > 0.999;
    context.vars['runNotFoundUnnamed'] = Math.random() > 0.999;

    return done();
  }
}
