from django import forms


class OMDbUploadForm(forms.Form):
    query = forms.CharField(
        max_length=100,
        label="Search Query",
        help_text="Enter a search term (e.g., 'Batman')",
        required=True,
    )
    apikey = forms.CharField(
        max_length=100,
        label="OMDb API Key",
        help_text="Enter your OMDb API key",
        required=True,
    )
