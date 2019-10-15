module.exports.defaultAppConfigBase = {
  "title": "DJVUE application",
  "description": "",
  "keywords": [],
  "isPublished": true,
    "pages": [
    {
      "title": "Home",
      "layout": "layout-1-2",
      "holders": {
        "Top": {
          "widgets": [
            {
              "type": "html-widget",
              "name": "noname",
              "icon": "mdi-language-html5",
              "options": {
                "widget": {
                  "visible": true
                }
              },
              "data": {
                "source": "embedded",
                "embedded": "<div class=\"subheading primary--text\" style=\"padding-bottom:3em;\">\n    <center>\n        <h1>\n            <span>\n                <img src=\"{{app.config.icon}}\" style=\"width:1em;padding:0.5em 0 0 0\">\n            </span>\n            {{app.title}}\n        </h1>\n        Dynamic reload content\n    </center>    \n</div>",
                "script": ""
              },
              "id": "brc5hkwvwqn"
            }
          ]
        },
        "Column 1": {
          "widgets": [
            {
              "type": "html-widget",
              "name": "noname",
              "icon": "mdi-language-html5",
              "options": {
                "widget": {
                  "visible": true
                }
              },
              "data": {
                "source": "embedded",
                "embedded": "<center>\n    <i>DJ{{app.config.description}}</i>    \n</center>\n",
                "script": ""
              },
              "id": "eqrqp6siyuf"
            }
          ]
        },
        "Column 2": {
          "widgets": [
            {
              "type": "html-widget",
              "name": "noname",
              "icon": "mdi-language-html5",
              "options": {
                "widget": {
                  "visible": true
                }
              },
              "data": {
                "source": "embedded",
                "embedded": "<center>\n    <i>This page use 1-2 column layout.</i>    \n</center>\n",
                "script": ""
              },
              "id": "oax4m3z4ep"
            }
          ]
        }
      }
    }
  ],


  "name": "",
  "i18n": {
    "en": {},
    "uk": {}
  },
  "icon": "",
   "skin": {
    "holders": {
      "AppHeader": {
        "widgets": [
          {
            "type": "html-widget",
            "name": "noname",
            "icon": "mdi-language-html5",
            "options": {
              "widget": {
                "visible": true
              }
            },
            "data": {
              "source": "embedded",
              "embedded": "<div style=\"padding:3em 0;\" class=\"primary white--text subheading\">\n    <center>\n        This app skin contains two static holders. This is \"AppHeader.\"    \n    </center>\n</div>\n",
              "script": ""
            },
            "id": "w5vd074og0p"
          }
        ]
      },
      "AppFooter": {
        "widgets": [
          {
            "type": "html-widget",
            "name": "noname",
            "icon": "mdi-language-html5",
            "options": {
              "widget": {
                "visible": true
              }
            },
            "data": {
              "source": "embedded",
              "embedded": "<div style=\"padding:3em 0;\" class=\"primary white--text subheading\">\n    <center>\n        This app skin contains two static holders. This is \"AppFooter.\"    \n    </center>\n</div>",
              "script": ""
            },
            "id": "361f70vcsjf"
          }
        ]
      }
    }
  },
 
  "dpsURL": "",
  "theme": {
    "primary": "#26A69A",
    "secondary": "#455A64",
    "accent": "#00796B",
    "error": "#EF5350",
    "warning": "#FF9800",
    "info": "#42A5F5",
    "success": "#00C853"
  }
}