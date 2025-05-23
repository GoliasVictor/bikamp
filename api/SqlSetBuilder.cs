class SqlSetBuilder
{
    private readonly List<string> campos = [];
    public SqlSetBuilder Field(bool should, string value)
    {
        if (should)
            campos.Add(value);
        return this;
    }
	public string Build()
    {
        return string.Join(", ", campos); ;
    }
}