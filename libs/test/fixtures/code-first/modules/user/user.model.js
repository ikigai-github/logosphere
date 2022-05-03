'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
const decorators_1 = require('@logosphere/decorators');
let UserEntity = class UserEntity {};
__decorate(
  [
    (0, decorators_1.Prop)({
      examples: ['babingo', 'creepingo', 'arduingo'],
    }),
    __metadata('design:type', String),
  ],
  UserEntity.prototype,
  'username',
  void 0
);
UserEntity = __decorate(
  [(0, decorators_1.Entity)({ name: 'user' })],
  UserEntity
);
let WalletEntity = class WalletEntity {};
__decorate(
  [
    (0, decorators_1.Prop)({
      examples: ['123', '456', '789'],
    }),
    __metadata('design:type', String),
  ],
  WalletEntity.prototype,
  'address',
  void 0
);
__decorate(
  [(0, decorators_1.Prop)(), __metadata('design:type', UserEntity)],
  WalletEntity.prototype,
  'owner',
  void 0
);
WalletEntity = __decorate(
  [(0, decorators_1.Entity)({ name: 'wallet' })],
  WalletEntity
);
//# sourceMappingURL=user.model.js.map
