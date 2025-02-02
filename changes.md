We have released a new major version of our SDK, and we recommend upgrading promptly.

It's a total rewrite of the library, so many things have changed, but we've made upgrading easy with a code migration script and detailed docs below. It was extensively beta tested prior to release.

Getting started
pip install --upgrade openai
What's changed
Auto-retry with backoff if there's an error
Proper types (for mypy/pyright/editors)
You can now instantiate a client, instead of using a global default.
Switch to explicit client instantiation
Weights and Biases CLI will now be included in their own package
Migration guide
For Azure OpenAI users, see Microsoft's Azure-specific migration guide.

Automatic migration with grit
You can automatically migrate your codebase using grit, either online or with the following CLI command on Mac or Linux:

openai migrate
The grit binary executes entirely locally with AST-based transforms.

Be sure to audit its changes: we suggest ensuring you have a clean working tree beforehand, and running git add --patch afterwards. Note that grit.io also offers opt-in automatic fixes powered by AI.

Automatic migration with grit on Windows
To use grit to migrate your code on Windows, you will need to use Windows Subsystem for Linux (WSL). Installing WSL is quick and easy, and you do not need to keep using Linux once the command is done.

Here's a step-by-step guide for setting up and using WSL for this purpose:

Open a PowerShell or Command Prompt as an administrator and run wsl --install.
Restart your computer.
Open the WSL application.
In the WSL terminal, cd into the appropriate directory (e.g., cd /mnt/c/Users/Myself/my/code/) and then run the following commands:
curl -fsSL https://docs.grit.io/install | bash
grit install
grit apply openai
Then, you can close WSL and go back to using Windows.

Automatic migration with grit in Jupyter Notebooks
If your Jupyter notebooks are not in source control, they will be more difficult to migrate. You may want to copy each cell into grit's web interface, and paste the output back in.

If you need to migrate in a way that preserves use of the module-level client instead of instantiated clients, you can use the openai_global grit migration instead.

Initialization
# old
import openai

openai.api_key = os.environ['OPENAI_API_KEY']

# new
from openai import OpenAI

client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY'],  # this is also the default, it can be omitted
)
Responses
Response objects are now pydantic models and no longer conform to the dictionary shape. However you can easily convert them to a dictionary with model.model_dump().

# before
import json
import openai

completion = openai.Completion.create(model='curie')
print(completion['choices'][0]['text'])
print(completion.get('usage'))
print(json.dumps(completion, indent=2))

# after
from openai import OpenAI

client = OpenAI()

completion = client.completions.create(model='curie')
print(completion.choices[0].text)
print(dict(completion).get('usage'))
print(completion.model_dump_json(indent=2))
Async client
We do not support calling asynchronous methods in the module-level client, instead you will have to instantiate an async client.

The rest of the API is exactly the same as the synchronous client.

# old
import openai

completion = openai.ChatCompletion.acreate(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])

# new
from openai import AsyncOpenAI

client = AsyncOpenAI()
completion = await client.chat.completions.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])
Module client
Important

We highly recommend instantiating client instances instead of relying on the global client.

We also expose a global client instance that is accessible in a similar fashion to versions prior to v1.

import openai

# optional; defaults to `os.environ['OPENAI_API_KEY']`
openai.api_key = '...'

# all client options can be configured just like the `OpenAI` instantiation counterpart
openai.base_url = "https://..."
openai.default_headers = {"x-foo": "true"}

completion = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": "How do I output all files in a directory using Python?",
        },
    ],
)
print(completion.choices[0].message.content)
The API is the exact same as the standard client instance based API.

This is intended to be used within REPLs or notebooks for faster iteration, not in application code.

We recommend that you always instantiate a client (e.g., with client = OpenAI()) in application code because:

It can be difficult to reason about where client options are configured
It's not possible to change certain client options without potentially causing race conditions
It's harder to mock for testing purposes
It's not possible to control cleanup of network connections
Pagination
All list() methods that support pagination in the API now support automatic iteration, for example:

from openai import OpenAI

client = OpenAI()

for job in client.fine_tuning.jobs.list(limit=1):
    print(job)
Previously you would have to explicitly call a .auto_paging_iter() method instead.
See the README for more details.

Azure OpenAI
To use this library with Azure OpenAI, use the AzureOpenAI class instead of the OpenAI class.

A more comprehensive Azure-specific migration guide is available on the Microsoft website.

Important

The Azure API shape differs from the core API shape which means that the static types for responses / params
won't always be correct.

from openai import AzureOpenAI

# gets the API Key from environment variable AZURE_OPENAI_API_KEY
client = AzureOpenAI(
    # https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#rest-api-versioning
    api_version="2023-07-01-preview",
    # https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource
    azure_endpoint="https://example-endpoint.openai.azure.com",
)

completion = client.chat.completions.create(
    model="deployment-name",  # e.g. gpt-35-instant
    messages=[
        {
            "role": "user",
            "content": "How do I output all files in a directory using Python?",
        },
    ],
)
print(completion.model_dump_json(indent=2))
In addition to the options provided in the base OpenAI client, the following options are provided:

azure_endpoint
azure_deployment
api_version
azure_ad_token
azure_ad_token_provider
An example of using the client with Azure Active Directory can be found here.

All name changes
Note: all a* methods have been removed; the async client must be used instead.

openai.api_base -> openai.base_url
openai.proxy -> openai.proxies (docs)
openai.InvalidRequestError -> openai.BadRequestError
openai.Audio.transcribe() -> client.audio.transcriptions.create()
openai.Audio.translate() -> client.audio.translations.create()
openai.ChatCompletion.create() -> client.chat.completions.create()
openai.Completion.create() -> client.completions.create()
openai.Edit.create() -> client.edits.create()
openai.Embedding.create() -> client.embeddings.create()
openai.File.create() -> client.files.create()
openai.File.list() -> client.files.list()
openai.File.retrieve() -> client.files.retrieve()
openai.File.download() -> client.files.retrieve_content()
openai.FineTune.cancel() -> client.fine_tunes.cancel()
openai.FineTune.list() -> client.fine_tunes.list()
openai.FineTune.list_events() -> client.fine_tunes.list_events()
openai.FineTune.stream_events() -> client.fine_tunes.list_events(stream=True)
openai.FineTune.retrieve() -> client.fine_tunes.retrieve()
openai.FineTune.delete() -> client.fine_tunes.delete()
openai.FineTune.create() -> client.fine_tunes.create()
openai.FineTuningJob.create() -> client.fine_tuning.jobs.create()
openai.FineTuningJob.cancel() -> client.fine_tuning.jobs.cancel()
openai.FineTuningJob.delete() -> client.fine_tuning.jobs.create()
openai.FineTuningJob.retrieve() -> client.fine_tuning.jobs.retrieve()
openai.FineTuningJob.list() -> client.fine_tuning.jobs.list()
openai.FineTuningJob.list_events() -> client.fine_tuning.jobs.list_events()
openai.Image.create() -> client.images.generate()
openai.Image.create_variation() -> client.images.create_variation()
openai.Image.create_edit() -> client.images.edit()
openai.Model.list() -> client.models.list()
openai.Model.delete() -> client.models.delete()
openai.Model.retrieve() -> client.models.retrieve()
openai.Moderation.create() -> client.moderations.create()
openai.api_resources -> openai.resources
Removed
openai.api_key_path
openai.app_info
openai.debug
openai.log
openai.OpenAIError
openai.Audio.transcribe_raw()
openai.Audio.translate_raw()
openai.ErrorObject
openai.Customer
openai.api_version
openai.verify_ssl_certs
openai.api_type
openai.enable_telemetry
openai.ca_bundle_path
openai.requestssession (we now use httpx)
openai.aiosession (we now use httpx)
openai.Deployment (only used for Azure) – please use the azure-mgmt-cognitiveservices client library instead (here's how to list deployments, for example).
openai.Engine
openai.File.find_matching_files()
openai.embeddings_utils (now in the cookbook)