/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
package org.graylog.plugins.pipelineprocessor.functions.maps;

import com.google.common.base.Strings;
import org.graylog.plugins.pipelineprocessor.EvaluationContext;
import org.graylog.plugins.pipelineprocessor.ast.functions.AbstractFunction;
import org.graylog.plugins.pipelineprocessor.ast.functions.FunctionArgs;
import org.graylog.plugins.pipelineprocessor.ast.functions.FunctionDescriptor;
import org.graylog.plugins.pipelineprocessor.ast.functions.ParameterDescriptor;
import org.graylog.plugins.pipelineprocessor.rulebuilder.RuleBuilderFunctionGroup;

import java.util.Map;

import static com.google.common.collect.ImmutableList.of;
import static org.graylog.plugins.pipelineprocessor.ast.functions.ParameterDescriptor.object;
import static org.graylog.plugins.pipelineprocessor.ast.functions.ParameterDescriptor.string;
import static org.graylog.plugins.pipelineprocessor.ast.functions.ParameterDescriptor.type;

public class MapSet extends AbstractFunction<Map> {
    public static final String NAME = "map_set";
    private static final String MAPARG = "map";
    private static final String KEYARG = "key";
    private static final String VALUEARG = "value";
    private final ParameterDescriptor<Map, Map> mapParam;
    private final ParameterDescriptor<String, String> keyParam;
    private final ParameterDescriptor<Object, Object> valueParam;

    public MapSet() {
        mapParam = type(MAPARG, Map.class).primary().description("A map").build();
        keyParam = string(KEYARG).description("Set this key in map").build();
        valueParam = object(VALUEARG).description("New value").build();
    }

    @Override
    public Map evaluate(FunctionArgs args, EvaluationContext context) {

        final Map<String, Object> mapValue = mapParam.required(args, context);
        final String keyValue = keyParam.required(args, context);
        final Object valueValue = valueParam.required(args, context);
        if (mapValue == null || Strings.isNullOrEmpty(keyValue)) {
            return mapValue;
        }

        mapValue.put(keyValue, valueValue);
        return mapValue;
    }

    @Override
    public FunctionDescriptor<Map> descriptor() {
        return FunctionDescriptor.<Map>builder()
                .name(NAME)
                .returnType(Map.class)
                .params(of(mapParam, keyParam, valueParam))
                .description("Set a key in the map")
                .ruleBuilderEnabled()
                .ruleBuilderName("Set key in map")
                .ruleBuilderTitle("Update '${keyValue}' in map")
                .ruleBuilderFunctionGroup(RuleBuilderFunctionGroup.OTHER)
                .build();
    }
}
