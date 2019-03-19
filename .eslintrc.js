module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true
  },
  "extends": "standard",
  "rules": {
    "import/extensions": [
      "error",
      "never",
      {
        "js": "never",
        "ts": "never",
        "vue": 'never'
      }
    ]
  },
  "plugins": ['html'],
  "overrides": [
    {
      "files": ["**/*.ts"],
      "parser": "typescript-eslint-parser",
      "plugins": [
          "typescript"
      ],
      "rules": {
        "no-undef": "allow",
        "typescript/adjacent-overload-signatures": "error",
        "typescript/class-name-casing": "error",
        "typescript/explicit-function-return-type": "error",
        "typescript/explicit-member-accessibility": "error",
        "typescript/interface-name-prefix": "error",
        "typescript/member-delimiter-style": "error",
        "typescript/member-naming": "error",
        "typescript/member-ordering": "error",
        "typescript/no-angle-bracket-type-assertion": "error",
        "typescript/no-array-constructor": "error",
        "typescript/no-empty-interface": "error",
        "typescript/no-explicit-any": "error",
        "typescript/no-namespace": "error",
        "typescript/no-non-null-assertion": "error",
        "typescript/no-parameter-properties": "error",
        "typescript/no-triple-slash-reference": "error",
        "typescript/no-type-alias": "error",
        "typescript/no-unused-vars": "error",
        "typescript/no-use-before-define": "error",
        "typescript/no-var-requires": "error",
        "typescript/prefer-namespace-keyword": "error",
        "typescript/type-annotation-spacing": "error"
      }
    }
  ]
}
