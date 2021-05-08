export default class WPromise {
  static pending = 'pending';
  static fulfilled = 'fulfilled';
  static rejected = 'rejected';
  value = undefined;
  status = WPromise.pending;
  reason = undefined;
  callbacks = [];
  constructor(executor) {
    executor(this.resovle.bind(this), this.reject.bind(this))
  }
  resovle(value) {
    if (value instanceof WPromise) {
      value.then(this.resovle.bind(this), this.reject.bind(this));
      return;
    }
    this.value = value;
    this.status = WPromise.fulfilled;
    this.callbacks.forEach(cb => this.handler(cb));
  }
  reject(reason) {
    if (reason instanceof WPromise) {
      reason.then(this.resovle.bind(this), this.reject.bind(this));
      return;
    }
    this.reason = reason;
    this.status = WPromise.rejected;
    this.callbacks.forEach(cb => this.handler(cb));
  }
  then(onFulfilled, onRejected) {
    return new WPromise((nextResovle, nextReject) => {
      this.handler({
        nextResovle,
        nextReject,
        onFulfilled,
        onRejected,
      })
    });
  }
  handler(cb) {
    const { nextResovle, nextReject, onFulfilled, onRejected } = cb;
    if (this.status === WPromise.pending) {
      this.callbacks.push(cb);
      return;
    }
    if (this.status === WPromise.fulfilled) {
      const nextValue = onFulfilled ? onFulfilled(this.valuie) : this.value;
      nextResovle(nextValue);
      return;
    }
    if (this.status === WPromise.rejected ) {
      const nextReason = onRejected ? onRejected(this.reason) : this.reason;
      nextReject(nextReason);
    }
  }
}